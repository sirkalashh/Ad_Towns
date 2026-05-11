using AdTowns.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using RazorLight;

namespace AdTowns.Services.Email;

public sealed class MailKitEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly IRazorLightEngine _razorLight;
    private readonly ILogger<MailKitEmailSender> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="MailKitEmailSender"/> class.
    /// </summary>
    public MailKitEmailSender(
        IOptions<EmailSettings> options,
        IRazorLightEngine razorLight,
        ILogger<MailKitEmailSender> logger)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(razorLight);
        ArgumentNullException.ThrowIfNull(logger);

        _settings = options.Value ?? throw new InvalidOperationException("EmailSettings are not configured.");
        _razorLight = razorLight;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<bool> SendAdminNotificationAsync(Registration registration, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(registration);
        EnsureSettings();

        var model = RegistrationEmailModel.FromRegistration(registration);
        var body = await RenderTemplateAsync("EmailTemplates/AdminNotification.cshtml", model);
        if (string.IsNullOrWhiteSpace(body))
        {
            return false;
        }

        var subject = $"New AdTowns Registration: {registration.ReferenceId}";
        var textBody = $"New Registration received.\nReference ID: {registration.ReferenceId}\nName: {registration.Name}\nEmail: {registration.Email}\nCheck admin panel for details.";
        var message = BuildMessage(_settings.AdminEmail, subject, body, textBody);

        await SendAsync(message, cancellationToken);
        _logger.LogInformation("Admin email sent to {AdminEmail} for registration {RegistrationId}.", _settings.AdminEmail, registration.Id);

        return true;
    }

    /// <inheritdoc />
    public async Task<bool> SendUserThankYouAsync(Registration registration, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(registration);
        EnsureSettings();

        var model = RegistrationEmailModel.FromRegistration(registration);
        var typeSegment = registration.Type.ToString().ToLowerInvariant();
        var templateKey = $"EmailTemplates/UserThanks_{typeSegment}.cshtml";

        var body = await RenderTemplateAsync(templateKey, model);
        if (string.IsNullOrWhiteSpace(body))
        {
            return false;
        }
        var subject = "Welcome to AdTowns — Registration Confirmed";
        var textBody = $"Hi {registration.Name},\n\nThank you for registering with AdTowns!\nYour Reference ID is {registration.ReferenceId}.\n\nVisit us at https://adtowns.com";
        var message = BuildMessage(registration.Email, subject, body, textBody);

        await SendAsync(message, cancellationToken);
        _logger.LogInformation("User email sent to {UserEmail} for registration {RegistrationId}.", registration.Email, registration.Id);

        return true;
    }

    private async Task<string?> RenderTemplateAsync(string templateKey, RegistrationEmailModel model)
    {
        try
        {
            return await _razorLight.CompileRenderAsync(templateKey, model);
        }
        catch (RazorLightException ex)
        {
            _logger.LogError(ex, "Template rendering failed for {TemplateKey}.", templateKey);
            return null;
        }
    }

    private MimeMessage BuildMessage(string toEmail, string subject, string htmlBody, string? textBody = null)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            throw new InvalidOperationException("Recipient email is missing.");
        }

        if (string.IsNullOrWhiteSpace(_settings.FromEmail))
        {
            throw new InvalidOperationException("FromEmail is missing.");
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;

        var builder = new BodyBuilder
        {
            HtmlBody = htmlBody,
            TextBody = textBody
        };

        message.Body = builder.ToMessageBody();
        return message;
    }

    private async Task SendAsync(MimeMessage message, CancellationToken cancellationToken)
    {
        using var client = new SmtpClient();
        if (_settings.AllowInvalidCertificates)
        {
            client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
        }

        client.AuthenticationMechanisms.Remove("XOAUTH2");

        var socketOptions = _settings.SmtpPort == 465
            ? SecureSocketOptions.SslOnConnect
            : SecureSocketOptions.StartTls;

        try
        {
            await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, socketOptions, cancellationToken);
            await client.AuthenticateAsync(_settings.SmtpUser, _settings.SmtpPass, cancellationToken);
            await client.SendAsync(message, cancellationToken);
        }
        finally
        {
            if (client.IsConnected)
            {
                await client.DisconnectAsync(true, cancellationToken);
            }
        }
    }

    private void EnsureSettings()
    {
        if (string.IsNullOrWhiteSpace(_settings.SmtpHost))
        {
            throw new InvalidOperationException("SmtpHost is missing.");
        }

        if (string.IsNullOrWhiteSpace(_settings.AdminEmail))
        {
            throw new InvalidOperationException("AdminEmail is missing.");
        }
    }

    public sealed record RegistrationEmailModel(
        string ReferenceId,
        string Name,
        string? Business,
        string Phone,
        string Email,
        string City,
        string Type,
        string? Message,
        DateTime SubmittedAt)
    {
        /// <summary>
        /// Creates a template model from a registration.
        /// </summary>
        /// <param name="registration">The registration.</param>
        /// <returns>The template model.</returns>
        public static RegistrationEmailModel FromRegistration(Registration registration)
        {
            ArgumentNullException.ThrowIfNull(registration);

            return new RegistrationEmailModel(
                registration.ReferenceId,
                registration.Name,
                registration.Business,
                registration.Phone,
                registration.Email,
                registration.City,
                registration.Type.ToString(),
                registration.Message,
                registration.SubmittedAt);
        }
    }
}
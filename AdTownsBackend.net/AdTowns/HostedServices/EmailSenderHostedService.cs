using AdTowns.Data;
using AdTowns.Infrastructure.EmailQueue;
using AdTowns.Services.Email;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using RazorLight;

namespace AdTowns.HostedServices;

public sealed class EmailSenderHostedService : BackgroundService
{
    private readonly IEmailQueue _emailQueue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<EmailSenderHostedService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="EmailSenderHostedService"/> class.
    /// </summary>
    public EmailSenderHostedService(
        IEmailQueue emailQueue,
        IServiceScopeFactory scopeFactory,
        ILogger<EmailSenderHostedService> logger)
    {
        _emailQueue = emailQueue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    /// <inheritdoc />
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            Guid registrationId;
            try
            {
                registrationId = await _emailQueue.DequeueAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            try
            {
                await ProcessRegistrationAsync(registrationId, stoppingToken);
            }
            catch (AuthenticationException ex)
            {
                _logger.LogError(ex, "SMTP authentication failed for registration {RegistrationId}.", registrationId);
            }
            catch (SmtpCommandException ex)
            {
                _logger.LogError(ex, "SMTP command error processing registration {RegistrationId}.", registrationId);
            }
            catch (SmtpProtocolException ex)
            {
                _logger.LogError(ex, "SMTP protocol error processing registration {RegistrationId}.", registrationId);
            }
            catch (IOException ex)
            {
                _logger.LogError(ex, "I/O error processing registration {RegistrationId}.", registrationId);
            }
            catch (RazorLightException ex)
            {
                _logger.LogError(ex, "Template rendering failed processing registration {RegistrationId}.", registrationId);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Invalid email settings processing registration {RegistrationId}.", registrationId);
            }
        }
    }

    private async Task ProcessRegistrationAsync(Guid registrationId, CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();

        var registration = await dbContext.Registrations
            .SingleOrDefaultAsync(r => r.Id == registrationId, cancellationToken);

        if (registration is null)
        {
            _logger.LogWarning("Registration {RegistrationId} not found for email processing.", registrationId);
            return;
        }

        var adminSent = false;
        var userSent = false;

        try
        {
            adminSent = await emailSender.SendAdminNotificationAsync(registration, cancellationToken);
        }
        catch (SmtpCommandException ex)
        {
            _logger.LogError(ex, "Failed to send admin email for registration {RegistrationId}.", registrationId);
        }
        catch (SmtpProtocolException ex)
        {
            _logger.LogError(ex, "SMTP protocol error sending admin email for registration {RegistrationId}.", registrationId);
        }
        catch (AuthenticationException ex)
        {
            _logger.LogError(ex, "SMTP authentication failed sending admin email for registration {RegistrationId}.", registrationId);
        }
        catch (IOException ex)
        {
            _logger.LogError(ex, "I/O error sending admin email for registration {RegistrationId}.", registrationId);
        }
        catch (RazorLightException ex)
        {
            _logger.LogError(ex, "Template rendering failed for admin email {RegistrationId}.", registrationId);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Invalid email settings for admin email {RegistrationId}.", registrationId);
        }

        try
        {
            userSent = await emailSender.SendUserThankYouAsync(registration, cancellationToken);
        }
        catch (SmtpCommandException ex)
        {
            _logger.LogError(ex, "Failed to send user email for registration {RegistrationId}.", registrationId);
        }
        catch (SmtpProtocolException ex)
        {
            _logger.LogError(ex, "SMTP protocol error sending user email for registration {RegistrationId}.", registrationId);
        }
        catch (AuthenticationException ex)
        {
            _logger.LogError(ex, "SMTP authentication failed sending user email for registration {RegistrationId}.", registrationId);
        }
        catch (IOException ex)
        {
            _logger.LogError(ex, "I/O error sending user email for registration {RegistrationId}.", registrationId);
        }
        catch (RazorLightException ex)
        {
            _logger.LogError(ex, "Template rendering failed for user email {RegistrationId}.", registrationId);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Invalid email settings for user email {RegistrationId}.", registrationId);
        }

        if (!adminSent && !userSent)
        {
            return;
        }

        if (adminSent)
        {
            registration.EmailSentToAdmin = true;
        }

        if (userSent)
        {
            registration.EmailSentToUser = true;
        }

        registration.EmailSentAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
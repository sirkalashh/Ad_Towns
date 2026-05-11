using AdTowns.Models;

namespace AdTowns.Services.Email;

public interface IEmailSender
{
    /// <summary>
    /// Sends the admin notification email for a registration.
    /// </summary>
    /// <param name="registration">The registration.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>True when the email is sent successfully.</returns>
    Task<bool> SendAdminNotificationAsync(Registration registration, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends the user thank-you email for a registration.
    /// </summary>
    /// <param name="registration">The registration.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>True when the email is sent successfully.</returns>
    Task<bool> SendUserThankYouAsync(Registration registration, CancellationToken cancellationToken = default);
}
namespace AdTowns.Infrastructure.EmailQueue;

public interface IEmailQueue
{
    /// <summary>
    /// Enqueues a registration email job.
    /// </summary>
    /// <param name="registrationId">The registration identifier.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    ValueTask EnqueueAsync(Guid registrationId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Dequeues a registration email job.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The registration identifier.</returns>
    ValueTask<Guid> DequeueAsync(CancellationToken cancellationToken = default);
}
using System.Threading.Channels;

namespace AdTowns.Infrastructure.EmailQueue;

public sealed class ChannelEmailQueue : IEmailQueue
{
    private readonly Channel<Guid> _channel;

    /// <summary>
    /// Initializes a new instance of the <see cref="ChannelEmailQueue"/> class.
    /// </summary>
    public ChannelEmailQueue()
    {
        _channel = Channel.CreateUnbounded<Guid>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });
    }

    /// <inheritdoc />
    public ValueTask EnqueueAsync(Guid registrationId, CancellationToken cancellationToken = default)
    {
        return _channel.Writer.WriteAsync(registrationId, cancellationToken);
    }

    /// <inheritdoc />
    public ValueTask<Guid> DequeueAsync(CancellationToken cancellationToken = default)
    {
        return _channel.Reader.ReadAsync(cancellationToken);
    }
}
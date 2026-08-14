namespace backend.Events;

public class EventBus(IServiceScopeFactory _scopeFactory, ILogger<EventBus> _logger) : IEventBus
{
    public async Task PublishAsync<TEvent>(TEvent eventHappen) where TEvent : DomainEvent
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var handlers = scope.ServiceProvider.GetServices<IEventHandler<TEvent>>();
        foreach (var handler in handlers)
        {
            try
            {
                await handler.HandleAsync(eventHappen);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EventBus handler error for {EventType}", typeof(TEvent).Name);
            }
        }
    }
}

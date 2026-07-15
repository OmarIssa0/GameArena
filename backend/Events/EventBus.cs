namespace backend.Events;

public class EventBus(IServiceScopeFactory _scopeFactory) : IEventBus
{
    public async Task PublishAsync<TEvent>(TEvent eventHappen) where TEvent : DomainEvent
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var handlers = scope.ServiceProvider.GetServices<IEventHandler<TEvent>>();
        foreach (var handler in handlers)
        {
            await handler.HandleAsync(eventHappen);
        }
    }
}

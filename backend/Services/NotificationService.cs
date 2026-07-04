using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services
{
    public class NotificationService(IHubContext<NotificationHub> _hub) : INotificationService
    {
        public Task SendToUserAsync(string userId, string method, object? arg)
        {
            return _hub.Clients.User(userId).SendAsync(method, arg);
        }

        public Task SendToGroupAsync(string groupName, string method, object? arg)
        {
            return _hub.Clients.Group(groupName).SendAsync(method, arg);
        }
    }
}

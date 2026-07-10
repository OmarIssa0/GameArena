using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{

    [Authorize]
    public class SocialHub(IUserPresenceService _presence, INotificationService _notificationService) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
                _presence.SetOnline(userId);
                await Clients.Others.SendAsync("friend:online", new { userId });
                if (Guid.TryParse(userId, out var guid))
                    await _notificationService.SendCountersAsync(guid);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                _presence.SetOffline(userId);
                await Clients.Others.SendAsync("friend:offline", new { userId });
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task RequestCounters()
        {
            var userId = Context.UserIdentifier;
            if (userId != null && Guid.TryParse(userId, out var guid))
            {
                await _notificationService.SendCountersAsync(guid);
            }
        }
    }
}

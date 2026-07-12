using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    [Authorize]
    public class SocialHub(
        IUserPresenceService _presence,
        INotificationService _notificationService,
        ISocialReadService _socialReadService,
        ILogger<SocialHub> _logger) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
                _presence.SetOnline(userId);

                if (Guid.TryParse(userId, out var guid))
                {
                    var friendIds = await _socialReadService.GetFriendIdsAsync(guid);
                    foreach (var friendId in friendIds)
                    {
                        await Clients.Group($"user:{friendId}").SendAsync("friend:online", new { userId });
                    }

                    try
                    {
                        await _notificationService.SendSocialDataAsync(guid);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to send social data to user {UserId} on connect", userId);
                    }
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                _presence.SetOffline(userId);

                if (Guid.TryParse(userId, out var guid))
                {
                    var friendIds = await _socialReadService.GetFriendIdsAsync(guid);
                    foreach (var friendId in friendIds)
                    {
                        await Clients.Group($"user:{friendId}").SendAsync("friend:offline", new { userId });
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task RequestCounters()
        {
            var userId = Context.UserIdentifier;
            if (userId != null && Guid.TryParse(userId, out var guid))
                await _notificationService.SendCountersAsync(guid);
        }

        public async Task RequestFriends()
        {
            var userId = Context.UserIdentifier;
            if (userId != null && Guid.TryParse(userId, out var guid))
                await _notificationService.SendFriendsAsync(guid);
        }

        public async Task RequestFriendRequests()
        {
            var userId = Context.UserIdentifier;
            if (userId != null && Guid.TryParse(userId, out var guid))
                await _notificationService.SendFriendRequestsAsync(guid);
        }

        public async Task RequestBlocked()
        {
            var userId = Context.UserIdentifier;
            if (userId != null && Guid.TryParse(userId, out var guid))
                await _notificationService.SendBlockedAsync(guid);
        }

        public async Task RequestSocialData()
        {
            var userId = Context.UserIdentifier;
            if (userId != null && Guid.TryParse(userId, out var guid))
                await _notificationService.SendSocialDataAsync(guid);
        }
    }
}

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
        private Guid? CurrentUserId =>
            Context.UserIdentifier is { Length: > 0 } id && Guid.TryParse(id, out var guid) ? guid : null;

        public override async Task OnConnectedAsync()
        {
            if (CurrentUserId is not { } userId) return;

            await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
            _presence.SetOnline(userId.ToString());

            var friendIds = await _socialReadService.GetFriendIdsAsync(userId);
            foreach (var friendId in friendIds)
            {
                await Clients.Group($"user:{friendId}").SendAsync("friend:online", new { userId = userId.ToString() });
            }

            try
            {
                await _notificationService.SendSocialDataAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send social data to user {UserId} on connect", userId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (CurrentUserId is not { } userId) return;

            _presence.SetOffline(userId.ToString());

            var friendIds = await _socialReadService.GetFriendIdsAsync(userId);
            foreach (var friendId in friendIds)
            {
                await Clients.Group($"user:{friendId}").SendAsync("friend:offline", new { userId = userId.ToString() });
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task RequestCounters()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendCountersAsync(userId);
        }

        public async Task RequestFriends()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendFriendsAsync(userId);
        }

        public async Task RequestFriendRequests()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendFriendRequestsAsync(userId);
        }

        public async Task RequestBlocked()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendBlockedAsync(userId);
        }

        public async Task RequestSocialData()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendSocialDataAsync(userId);
        }
    }
}

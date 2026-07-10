using backend.DTOs.Responses;
using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<SocialHub> _hub;

        private readonly IFriendService _friendService;
        private readonly IChatService _chatService;
        private readonly IGameService _gameService;

        public NotificationService(
            IHubContext<SocialHub> hub,
            IFriendService friendService,
            IChatService chatService,
            IGameService gameService)
        {
            _hub = hub;
            _friendService = friendService;
            _chatService = chatService;
            _gameService = gameService;
        }

        public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
        {
            return new NotificationCountersResponse
            {
                FriendRequests = await _friendService.GetFriendRequestCountAsync(userId),
                Friends = await _friendService.GetFriendCountAsync(userId),
                UnreadMessages = await _chatService.GetUnreadMessagesCountAsync(userId)
            };
        }

        public async Task SendCountersAsync(Guid userId)
        {
            var counters = await GetCountersAsync(userId);

            await _hub.Clients
                .Group($"user:{userId}")
                .SendAsync("notification:update", counters);
        }
    }
}

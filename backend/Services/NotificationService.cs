using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class NotificationService(
        IHubContext<SocialHub> hub,
        ISocialReadService socialReadService,
        IDbContextFactory<AppDbContext> contextFactory) : INotificationService
    {
        public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();

            var receivedRequests = await context.FriendRequests
                .CountAsync(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending);

            var sentRequests = await context.FriendRequests
                .CountAsync(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending);

            var friends = await context.UserFriends
                .CountAsync(uf => uf.UserId == userId && !context.Blocks.Any(b =>
                    (b.BlockerId == userId && b.BlockedId == uf.FriendId) ||
                    (b.BlockerId == uf.FriendId && b.BlockedId == userId)));

            var unreadMessages = await context.Messages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);

            return new NotificationCountersResponse
            {
                ReceivedFriendRequests = receivedRequests,
                SentFriendRequests = sentRequests,
                Friends = friends,
                UnreadMessages = unreadMessages
            };
        }

        public async Task SendCountersAsync(Guid userId)
        {
            var counters = await GetCountersAsync(userId);

            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("notification:update", counters);
        }

        public async Task SendFriendsAsync(Guid userId)
        {
            var friends = await socialReadService.GetFriendsAsync(userId, null);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:friends", friends);
        }

        public async Task SendFriendRequestsAsync(Guid userId)
        {
            var received = await socialReadService.GetReceivedRequestsAsync(userId);
            var sent = await socialReadService.GetSentRequestsAsync(userId);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:requests", new { received, sent });
        }

        public async Task SendBlockedAsync(Guid userId)
        {
            var blocked = await socialReadService.GetBlockedUsersAsync(userId);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:blocked", blocked);
        }


        public async Task SendSocialDataAsync(Guid userId)
        {
            // Fetch all social data in parallel and send as a single batched event
            // This prevents UI flicker from multiple sequential SignalR pushes
            var friendsTask = socialReadService.GetFriendsAsync(userId, null);
            var receivedTask = socialReadService.GetReceivedRequestsAsync(userId);
            var sentTask = socialReadService.GetSentRequestsAsync(userId);
            var blockedTask = socialReadService.GetBlockedUsersAsync(userId);
            var countersTask = GetCountersAsync(userId);

            await Task.WhenAll(friendsTask, receivedTask, sentTask, blockedTask, countersTask);

            var batch = new SocialDataBatchResponse
            {
                Friends = friendsTask.Result,
                ReceivedRequests = receivedTask.Result,
                SentRequests = sentTask.Result,
                BlockedUsers = blockedTask.Result,
                Counters = countersTask.Result
            };

            try
            {
                await hub.Clients
                    .Group($"user:{userId}")
                    .SendAsync("social:all", batch);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(
                    $"Failed to send social data to user {userId}: {ex.Message}");
            }
        }

        public async Task<List<NotificationResponse>> GetNotificationsAsync(Guid userId, int limit = 50)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            var notifications = await context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .AsNoTracking()
                .ToListAsync();

            return notifications.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<int> GetUnreadNotificationCountAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            return await context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<NotificationResponse> CreateNotificationAsync(Guid userId, string type, string title, string body, string? referenceId = null)
        {
            await using var context = await contextFactory.CreateDbContextAsync();

            if (!Enum.TryParse<NotificationType>(type, true, out var notificationType))
                throw new ArgumentException($"Invalid notification type: {type}", nameof(type));

            var notification = new Notification
            {
                UserId = userId,
                Type = notificationType,
                Title = title,
                Body = body,
                ReferenceId = referenceId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            context.Notifications.Add(notification);
            await context.SaveChangesAsync();

            var response = MapperHelper.ToDto(notification);

            try
            {
                await hub.Clients
                    .Group($"user:{userId}")
                    .SendAsync("notification:new", response);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(
                    $"Failed to push notification:new to user {userId}: {ex.Message}");
            }

            return response;
        }

        public async Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            var notification = await context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
            if (notification != null)
            {
                notification.IsRead = true;
                await context.SaveChangesAsync();
            }
        }

        public async Task MarkAllNotificationsAsReadAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            await context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        }

        public async Task DeleteNotificationAsync(Guid userId, Guid notificationId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            await context.Notifications
                .Where(n => n.Id == notificationId && n.UserId == userId)
                .ExecuteDeleteAsync();
        }
    }
}

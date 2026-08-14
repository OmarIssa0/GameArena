using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ChatService(AppDbContext _context, IEventBus _eventBus) : IChatService
    {
        public async Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId)
        {
            await _context.Messages
                .Where(m => m.ReceiverId == userId && m.SenderId == friendId && !m.IsRead)
                .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.IsRead, true));

            var messages = await _context.Messages
                .AsNoTracking()
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == friendId) ||
                    (m.SenderId == friendId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return messages.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<MessageResponse> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message)
        {
            if (await SocialQueryHelper.GetBlockerAsync(_context, senderId, receiverId) != null)
                throw new AppException(ErrorCode.UserBlockedYou);

            if (!await SocialQueryHelper.AreFriendsAsync(_context, senderId, receiverId))
                throw new AppException(ErrorCode.IsNotFriend);

            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = message,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();

            await _eventBus.PublishAsync(new ChatMessageSentEvent(senderId, receiverId, message, msg.SentAt));

            return MapperHelper.ToDto(msg);
        }

        public async Task<List<PerFriendUnreadCountResponse>> GetUnreadCountsPerFriendAsync(Guid userId)
        {
            return await _context.Messages
                .Where(m => m.ReceiverId == userId && !m.IsRead)
                .GroupBy(m => m.SenderId)
                .Select(g => new PerFriendUnreadCountResponse
                {
                    FriendId = g.Key,
                    UnreadCount = g.Count()
                })
                .ToListAsync();
        }
    }
}
using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class FriendService(AppDbContext _context, IEventBus _eventBus, ILogger<FriendService> _logger) : IFriendService, ISocialReadService
    {
        public async Task SendRequestAsync(Guid senderId, Guid receiverId)
        {
            if (senderId == receiverId)
                throw new AppException(ErrorCode.InvalidRequest);

            var (blocked, userBlockedBy) = await IsBlockedAsync(senderId, receiverId);
            if (blocked)
                throw new AppException(userBlockedBy == receiverId ? ErrorCode.UserBlockedYou : ErrorCode.YouBlockedUser);

            if (await _context.UserFriends.AnyAsync(x =>
                (x.UserId == senderId && x.FriendId == receiverId) ||
                (x.UserId == receiverId && x.FriendId == senderId)))
                throw new AppException(ErrorCode.AlreadyFriends);

            var existingRequest = await _context.FriendRequests
                .Where(fr => fr.Status == FriendRequestStatus.Pending &&
                             ((fr.SenderId == senderId && fr.ReceiverId == receiverId) ||
                              (fr.SenderId == receiverId && fr.ReceiverId == senderId)))
                .Select(fr => fr.SenderId == senderId ? 1 : 2)
                .FirstOrDefaultAsync();

            if (existingRequest == 1)
                throw new AppException(ErrorCode.RequestAlreadyExists);
            if (existingRequest == 2)
                throw new AppException(ErrorCode.ReceiverHasAlreadySentRequest);

            _context.FriendRequests.Add(new FriendRequest
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Status = FriendRequestStatus.Pending
            });

            await _context.SaveChangesAsync();

            var sender = await _context.Users
                .Where(u => u.Id == senderId)
                .Select(u => new { u.UserName })
                .FirstAsync();

            await _eventBus.PublishAsync(new FriendRequestSentEvent(senderId, receiverId, sender.UserName!));
        }

        public async Task AcceptRequestAsync(Guid userId, Guid senderId)
        {
            var (blocked, userBlockedBy) = await IsBlockedAsync(userId, senderId);
            if (blocked)
                throw new AppException(userBlockedBy == senderId ? ErrorCode.YouBlockedUser : ErrorCode.UserBlockedYou);

            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                request.Status = FriendRequestStatus.Accepted;

                var existingFriendships = await _context.UserFriends
                    .Where(x => (x.UserId == userId && x.FriendId == senderId) ||
                                (x.UserId == senderId && x.FriendId == userId))
                    .Select(x => x.UserId)
                    .ToListAsync();

                if (!existingFriendships.Contains(userId))
                    _context.UserFriends.Add(new UserFriends { UserId = userId, FriendId = senderId });
                if (!existingFriendships.Contains(senderId))
                    _context.UserFriends.Add(new UserFriends { UserId = senderId, FriendId = userId });

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateException)
            {
                await transaction.RollbackAsync();

                _context.ChangeTracker.Clear();
                var currentRequest = await _context.FriendRequests
                    .AsNoTracking()
                    .FirstOrDefaultAsync(fr =>
                        fr.SenderId == senderId &&
                        fr.ReceiverId == userId);

                if (currentRequest?.Status == FriendRequestStatus.Accepted)
                    throw new AppException(ErrorCode.AlreadyFriends);

                _logger.LogWarning("Race condition on friendship insert between {UserId} and {SenderId}, rolling back", userId, senderId);
                throw new AppException(ErrorCode.RequestAlreadyProcessed);
            }

            var accepter = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.UserName })
                .FirstAsync();

            await _eventBus.PublishAsync(new FriendRequestAcceptedEvent(senderId, userId, accepter.UserName!));
        }

        public async Task DeclineRequestAsync(Guid userId, Guid senderId)
        {
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Rejected;
            await _context.SaveChangesAsync();

            await _eventBus.PublishAsync(new FriendRequestDeclinedEvent(senderId, userId));
        }

        public async Task CancelRequestAsync(Guid userId, Guid receiverId)
        {
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == userId &&
                    fr.ReceiverId == receiverId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Cancelled;
            await _context.SaveChangesAsync();
            await _eventBus.PublishAsync(new FriendRequestCancelledEvent(userId, receiverId));
        }

        public async Task RemoveFriendAsync(Guid userId, Guid friendId)
        {
            var friendships = await _context.UserFriends
                .Where(uf =>
                    (uf.UserId == userId && uf.FriendId == friendId) ||
                    (uf.UserId == friendId && uf.FriendId == userId))
                .ToListAsync();

            if (friendships.Count == 0)
                throw new AppException(ErrorCode.IsNotFriend);

            _context.UserFriends.RemoveRange(friendships);
            await _context.SaveChangesAsync();
            await _eventBus.PublishAsync(new FriendRemovedEvent(userId, friendId));
        }

        public async Task BlockUserAsync(Guid blockerId, Guid blockedId)
        {
            if (blockerId == blockedId)
                throw new AppException(ErrorCode.CannotSelfBlock);

            if (await _context.Blocks.AnyAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId))
                throw new AppException(ErrorCode.AlreadyBlocked);

            _context.Blocks.Add(new Block { BlockerId = blockerId, BlockedId = blockedId });

            var friendships = await _context.UserFriends
                .Where(uf =>
                    (uf.UserId == blockerId && uf.FriendId == blockedId) ||
                    (uf.UserId == blockedId && uf.FriendId == blockerId))
                .ToListAsync();

            _context.UserFriends.RemoveRange(friendships);

            var pendingRequests = await _context.FriendRequests
                .Where(fr =>
                    fr.Status == FriendRequestStatus.Pending &&
                    ((fr.SenderId == blockerId && fr.ReceiverId == blockedId) ||
                     (fr.SenderId == blockedId && fr.ReceiverId == blockerId)))
                .ToListAsync();

            foreach (var req in pendingRequests)
            {
                req.Status = FriendRequestStatus.Cancelled;
            }

            await _context.SaveChangesAsync();

            foreach (var req in pendingRequests)
            {
                await _eventBus.PublishAsync(new FriendRequestCancelledEvent(req.SenderId, req.ReceiverId));
            }

            await _eventBus.PublishAsync(new UserBlockedEvent(blockerId, blockedId));
        }

        public async Task UnblockUserAsync(Guid blockerId, Guid blockedId)
        {
            var block = await _context.Blocks
                .FirstOrDefaultAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId)
                ?? throw new AppException(ErrorCode.NotBlocked);

            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();
        }

        public async Task<List<UserSummaryResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter)
        {
            var blockedIds = await _context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId || b.BlockedId == userId)
                .Select(b => b.BlockerId == userId ? b.BlockedId : b.BlockerId)
                .ToHashSetAsync();

            var query = _context.UserFriends
                .AsNoTracking()
                .Where(x => x.UserId == userId && !blockedIds.Contains(x.FriendId))
                .Select(x => x.Friend);

            if (filter != null && !string.IsNullOrWhiteSpace(filter.Name))
            {
                var searchTerm = filter.Name.ToLower();
                query = query.Where(u =>
                    u.UserName != null && u.UserName.ToLower().Contains(searchTerm));
            }

            return (await query.ToListAsync()).Select(MapperHelper.ToDtoSummary).ToList();
        }

        public async Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId)
        {
            var requests = await _context.FriendRequests
                .AsNoTracking()
                .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
                .Include(u => u.Sender)
                .ToListAsync();

            return requests.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId)
        {
            var requests = await _context.FriendRequests
                .AsNoTracking()
                .Where(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending)
                .Include(fr => fr.Receiver)
                .ToListAsync();

            return requests.Select(MapperHelper.ToSentRequestDto).ToList();
        }

        public async Task<List<UserSummaryResponse>> GetBlockedUsersAsync(Guid userId)
        {
            var blocked = await _context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId)
                .Select(b => b.Blocked)
                .ToListAsync();

            return blocked.Select(MapperHelper.ToDtoSummary).ToList();
        }

        public async Task<int> GetFriendRequestCountAsync(Guid userId)
        {
            return await _context.FriendRequests
                .CountAsync(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending);
        }

        public async Task<int> GetFriendCountAsync(Guid userId)
        {
            var blockedIds = await _context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId || b.BlockedId == userId)
                .Select(b => b.BlockerId == userId ? b.BlockedId : b.BlockerId)
                .ToHashSetAsync();

            return await _context.UserFriends
                .AsNoTracking()
                .Where(uf => uf.UserId == userId && !blockedIds.Contains(uf.FriendId))
                .CountAsync();
        }

        public async Task<HashSet<Guid>> GetFriendIdsAsync(Guid userId)
        {
            var blockedIds = await _context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId || b.BlockedId == userId)
                .Select(b => b.BlockerId == userId ? b.BlockedId : b.BlockerId)
                .ToHashSetAsync();

            return await _context.UserFriends
                .AsNoTracking()
                .Where(uf => uf.UserId == userId && !blockedIds.Contains(uf.FriendId))
                .Select(uf => uf.FriendId)
                .ToHashSetAsync();
        }

        private async Task<(bool Blocked, Guid WhoBlocked)> IsBlockedAsync(Guid firstUserId, Guid secondUserId)
        {
            var block = await _context.Blocks.FirstOrDefaultAsync(b =>
                (b.BlockerId == secondUserId && b.BlockedId == firstUserId) ||
                (b.BlockerId == firstUserId && b.BlockedId == secondUserId));
            return (block != null, block?.BlockerId ?? Guid.Empty);
        }
    }
}
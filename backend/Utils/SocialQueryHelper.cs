using backend.Data;
using backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Utils
{
    public static class SocialQueryHelper
    {
        public static Task<bool> AreFriendsAsync(AppDbContext context, Guid firstUserId, Guid secondUserId)
            => context.UserFriends.AnyAsync(uf =>
                (uf.UserId == firstUserId && uf.FriendId == secondUserId) ||
                (uf.UserId == secondUserId && uf.FriendId == firstUserId));

        public static Task<Guid?> GetBlockerAsync(AppDbContext context, Guid firstUserId, Guid secondUserId)
            => context.Blocks
                .Where(b =>
                    (b.BlockerId == firstUserId && b.BlockedId == secondUserId) ||
                    (b.BlockerId == secondUserId && b.BlockedId == firstUserId))
                .Select(b => (Guid?)b.BlockerId)
                .FirstOrDefaultAsync();

        public static Task<List<UserFriends>> GetFriendshipsAsync(AppDbContext context, Guid firstUserId, Guid secondUserId)
            => context.UserFriends
                .Where(uf =>
                    (uf.UserId == firstUserId && uf.FriendId == secondUserId) ||
                    (uf.UserId == secondUserId && uf.FriendId == firstUserId))
                .ToListAsync();

        public static Task<bool> AreEitherBlockedAsync(AppDbContext context, Guid userId, Guid otherUserId)
            => context.Blocks.AnyAsync(b =>
                (b.BlockerId == userId && b.BlockedId == otherUserId) ||
                (b.BlockerId == otherUserId && b.BlockedId == userId));

        public static Task<List<Guid>> GetAllBlockedIdsAsync(AppDbContext context, Guid userId)
            => context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId || b.BlockedId == userId)
                .Select(b => b.BlockerId == userId ? b.BlockedId : b.BlockerId)
                .ToListAsync();
    }
}

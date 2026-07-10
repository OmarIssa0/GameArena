using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class MatchHistoryService(AppDbContext _context) : IMatchHistoryService
    {
        public async Task<List<MatchHistoryResponse>> GetMatchHistoryByUserIdAsync(Guid userId)
        {
            var matches = await _context.MatchHistories
                .Include(m => m.Player1)
                .Include(m => m.Player2)
                .Where(mh => mh.Player1Id == userId || mh.Player2Id == userId)
                .OrderByDescending(m => m.CompletedAt)
                .ToListAsync();

            return [.. matches.Select(m => MapperHelper.ToDto(m, userId))];
        }

        public async Task SaveMatchHistoryAsync(BaseGameRoom room)
        {
            if (room?.Player1Id == null || room.Player2Id == null)
                throw new AppException(room == null ? ErrorCode.RoomNotFound : ErrorCode.PlayerNotFound);

            _context.MatchHistories.Add(new MatchHistory
            {
                RoomId = room.RoomId,
                GameType = room.GameType,
                Player1Id = Guid.Parse(room.Player1Id!),
                Player2Id = Guid.Parse(room.Player2Id!),
                WinnerId = room.WinnerPlayerId != null ? Guid.Parse(room.WinnerPlayerId) : null,
                CompletedAt = DateTime.UtcNow,
                Status = room.WinnerPlayerId != null ? MatchStatus.Win : MatchStatus.Draw
            });
            await _context.SaveChangesAsync();
        }
    }
}

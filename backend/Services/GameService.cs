using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;

namespace backend.Services
{
    public class GameService(AppDbContext _context) : IGameService
    {
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

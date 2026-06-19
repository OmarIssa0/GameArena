using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class GameService : IGameService
    {
        private readonly IDbContextFactory<AppDbContext> _contextFactory;
        public GameService(IDbContextFactory<AppDbContext> context)
        {
            _contextFactory = context;
        }
        public async Task SaveMatchHistoryAsync(TicTacTaoRoom room)
        {
            try
            {

            // Save match history to the database thread-safely using a new DbContext instance
            using var context = await _contextFactory.CreateDbContextAsync();
            var historyRecord = new MatchHistory
            {
                RoomId = room.RoomId,
                GameType = GamesKind.TicTacTao,
                Player1Id = room.Player1Id!,
                Player2Id = room.Player2Id!,
                WinnerId = room.WinnerPlayerId,
                Status = room.WinnerSymbol,
                CompletedAt = DateTime.UtcNow
            };
            context.MatchHistories.Add(historyRecord);
            await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw; // Rethrow or handle accordingly
            }
        }
}
}

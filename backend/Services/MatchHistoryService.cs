using backend.Data;
using backend.DTOs.Responses;
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
    }
}

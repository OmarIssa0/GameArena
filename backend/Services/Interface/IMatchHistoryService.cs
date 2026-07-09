using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IMatchHistoryService
    {
        Task<List<MatchHistoryResponse>> GetMatchHistoryByUserIdAsync(Guid userId);
    }
}

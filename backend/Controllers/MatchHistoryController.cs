using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Responses;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MatchHistoryController(IMatchHistoryService _matchHistoryService, ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<MatchHistoryResponse>>>> GetMatchHistory()
        {
            var matchHistory = await _matchHistoryService.GetMatchHistoryByUserIdAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<MatchHistoryResponse>> { Data = matchHistory });
        }
    }
}

using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendController(
        IFriendService _friendService,
        ISocialReadService _socialReadService,
        ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpPost("request/{receiverId}")]
        public async Task<ActionResult<ApiResponse<object>>> SendRequest(Guid receiverId)
        {
            await _friendService.SendRequestAsync(_currentUser.UserId, receiverId);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("accept/{senderId}")]
        public async Task<ActionResult<ApiResponse<object>>> AcceptRequest(Guid senderId)
        {
            await _friendService.AcceptRequestAsync(_currentUser.UserId, senderId);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("decline/{senderId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeclineRequest(Guid senderId)
        {
            await _friendService.DeclineRequestAsync(_currentUser.UserId, senderId);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("remove/{friendId}")]
        public async Task<ActionResult<ApiResponse<object>>> RemoveFriend(Guid friendId)
        {
            await _friendService.RemoveFriendAsync(_currentUser.UserId, friendId);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("block/{blockedId}")]
        public async Task<ActionResult<ApiResponse<object>>> BlockUser(Guid blockedId)
        {
            await _friendService.BlockUserAsync(_currentUser.UserId, blockedId);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("unblock/{blockedId}")]
        public async Task<ActionResult<ApiResponse<object>>> UnblockUser(Guid blockedId)
        {
            await _friendService.UnblockUserAsync(_currentUser.UserId, blockedId);
            return Ok(new ApiResponse<object>());
        }
        [HttpPost("cancel-request/{receiverId}")]
        public async Task<ActionResult<ApiResponse<object>>> CancelRequest(Guid receiverId)
        {
            await _friendService.CancelRequestAsync(_currentUser.UserId, receiverId);
            return Ok(new ApiResponse<object>());
        }
        [HttpPost("friends")]
        public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> GetFriends([FromBody] UserFilterRequest filter)
        {
            var friends = await _socialReadService.GetFriendsAsync(_currentUser.UserId, filter);
            return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = friends });
        }

        [HttpGet("requests")]
        public async Task<ActionResult<ApiResponse<List<FriendRequestReceivedResponse>>>> GetReceivedRequests()
        {
            var requests = await _socialReadService.GetReceivedRequestsAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<FriendRequestReceivedResponse>> { Data = requests });
        }

        [HttpGet("sent")]
        public async Task<ActionResult<ApiResponse<List<FriendRequestSentResponse>>>> GetSentRequests()
        {
            var requests = await _socialReadService.GetSentRequestsAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<FriendRequestSentResponse>> { Data = requests });
        }

        [HttpGet("blocked")]
        public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> GetBlockedUsers()
        {
            var blocked = await _socialReadService.GetBlockedUsersAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = blocked });
        }
    }
}

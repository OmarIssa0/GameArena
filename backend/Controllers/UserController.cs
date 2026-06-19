using backend.Domain;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [Authorize]
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return user == null ? NotFound(): Ok(user);
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsersAsync() 
        { 
            var users = await _userService.GetAllUsersAsync();
            return users is null ? NotFound("There is No users Created"): Ok(users);
        }

        [Authorize]
        [HttpGet("getFriend/{id}")]
        public async Task<IActionResult> GetUserFriends(Guid id)
        {
            var friends = await _userService.GetUserFriends(id);
            return friends is null ?  NotFound("This user has no friends") : Ok(friends);
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();
            var user = await _userService.GetUserByIdAsync(Guid.Parse(userIdClaim.Value));
            return user == null ? NotFound() : Ok(user);
        }
    }
}

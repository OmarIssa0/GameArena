using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IUserService
    {
        Task<UserResponse> GetUserByIdAsync(Guid userId);
        Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter);
        Task<UserResponse> UpdateUserAsync(Guid currentUserId, UserResponse request);
        Task<UserResponse> UpdateProfileAsync(Guid userId, RegisterRequest request);
        Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
    }
}

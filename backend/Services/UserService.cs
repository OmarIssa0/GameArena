using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService(AppDbContext _context, IUserPresenceService _presence) : IUserService
    {
        public async Task<UserResponse> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);

            return user.ToResponse();
        }

        public async Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter)
        {
            if (string.IsNullOrWhiteSpace(filter?.Name)) return [];

            var name = filter.Name.Trim().ToLower();

            var users = await _context.Users
                .Where(u => u.Id != currentUserId)
                .Where(u => u.UserName != null && u.UserName.ToLower().Contains(name))
                .Select(u => new UserSummaryResponse(u.Id, u.UserName, u.FirstName, u.LastName, u.Status))
                .ToListAsync();

            var results = users.Select(u => u with { Status = _presence.GetStatus(u.Id.ToString()) });
            if (filter.UserStatus != UserStatus.All)
                results = results.Where(dto => dto.Status == filter.UserStatus);
            return [.. results];
        }

        public async Task<UserResponse> UpdateProfileAsync(Guid userId, RegisterRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);
            user.UserName = request.UserName;
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            await _context.SaveChangesAsync();
            return user.ToResponse();
        }

        public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);
            if (!AuthHelper.VerifyPassword(user, user.PasswordHash, oldPassword))
                throw new AppException(ErrorCode.InvalidCredentials);
            user.PasswordHash = AuthHelper.HashPassword(user, newPassword);
            var tokens = await _context.RefreshTokens.Where(t => t.UserId == userId).ToListAsync();
            _context.RefreshTokens.RemoveRange(tokens);
            await _context.SaveChangesAsync();
        }

        public async Task<string?> GetPreferencesAsync(Guid userId)
            => await _context.Users.Where(u => u.Id == userId).Select(u => u.Preferences).FirstOrDefaultAsync()
               ?? throw new AppException(ErrorCode.UserNotFound);

        public async Task UpdatePreferencesAsync(Guid userId, string preferencesJson)
        {
            var rows = await _context.Users.Where(u => u.Id == userId)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.Preferences, preferencesJson));
            if (rows == 0) throw new AppException(ErrorCode.UserNotFound);
        }
    }
}

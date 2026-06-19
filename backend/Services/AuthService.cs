using backend.Data;
using backend.Domain;
using backend.DTOs;
using backend.Enums;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailVerificationService _emailVerificationService;

        public AuthService(
            AppDbContext context,
            IConfiguration configuration,
            IEmailVerificationService emailVerificationService
        )
        {
            _context = context;
            _configuration = configuration;
            _emailVerificationService = emailVerificationService; 
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return null;

            if (!user.IsVerified)
                throw new Exception("EMAIL_NOT_VERIFIED");

            var passwordCheck =
                AuthHelper.VerifyPassword(user, user.PasswordHash, request.Password);

            if (!passwordCheck)
                return null;

            var accessToken = AuthHelper.CreateToken(user, _configuration);
            var rawRefreshToken = AuthHelper.GenerateRefreshTokenString();

            await SaveNewRefreshToken(user.Id, rawRefreshToken);

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken
            };
        }
        public async Task RevokeRefreshTokenAsync(string rawToken)
        {
            var tokenHash = AuthHelper.ComputeHash(rawToken);

            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

            if (storedToken != null)
            {
                _context.RefreshTokens.Remove(storedToken);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User?> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return null;

            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = AuthHelper.HashPassword(new User(), request.Password),
                Role = UserRole.User,
                IsVerified = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _emailVerificationService.GenerateAndSendOtpAsync(user.Email);

            return user;
        }

        public async Task<AuthResponse?> RefreshAccessTokenAsync(string rawRefreshToken)
        {
            string tokenHash = AuthHelper.ComputeHash(rawRefreshToken);

            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

            if (storedToken == null || storedToken.ExpiresAt <= DateTime.UtcNow)
                return null;

            _context.RefreshTokens.Remove(storedToken);

            var newAccessToken = AuthHelper.CreateToken(storedToken.User, _configuration);
            var newRefreshToken = AuthHelper.GenerateRefreshTokenString();

            await SaveNewRefreshToken(storedToken.User.Id, newRefreshToken);

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        private async Task SaveNewRefreshToken(Guid userId, string rawRefreshToken)
        {
            var tokenHash = AuthHelper.ComputeHash(rawRefreshToken);

            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = userId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _context.SaveChangesAsync();
        }
    }
}
using backend.Data;
using backend.Domain;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        public EmailVerificationService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task GenerateAndSendOtpAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return;

            var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            var hash = Hash(otp);

            _context.EmailVerfications.Add(new EmailVerfication
            {
                UserId = user.Id,
                OtpHash = hash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            });

            await _context.SaveChangesAsync();

            await _emailService.SendAsync(
                user.Email,
                "OTP Verification",
                $"Your OTP is: {otp}"
            );
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return false;

            var record = await _context.EmailVerfications
                .Where(x => x.UserId == user.Id && !x.IsUsed)
                .OrderByDescending(x => x.ExpiresAt)
                .FirstOrDefaultAsync();

            if (record == null) return false;
            if (record.ExpiresAt < DateTime.UtcNow) return false;

            if (record.OtpHash != Hash(otp)) return false;

            record.IsUsed = true;
            user.IsVerified = true;

            await _context.SaveChangesAsync();
            return true;
        }

        private string Hash(string otp)
        {
            return Convert.ToBase64String(
                SHA256.HashData(Encoding.UTF8.GetBytes(otp))
            );
        }
    }
}
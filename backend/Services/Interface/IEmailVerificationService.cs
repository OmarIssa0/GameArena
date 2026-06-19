namespace backend.Services.Interface
{
    public interface IEmailVerificationService
    {
        Task GenerateAndSendOtpAsync(string email);
        Task<bool> VerifyOtpAsync(string email, string otp);
    }
}

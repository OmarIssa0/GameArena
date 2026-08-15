using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record VerifyOtpRequest(
        [Required, EmailAddress] string Email,
        [Required] string Otp);
}

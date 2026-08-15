using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record VerifyOtpRequest(
        [property: Required, EmailAddress] string Email,
        [property: Required] string Otp);
}

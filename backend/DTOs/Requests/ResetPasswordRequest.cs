using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record ResetPasswordRequest(
        [Required, EmailAddress] string Email,
        [Required] string Otp,
        [Required] string NewPassword);

}
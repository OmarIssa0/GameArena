using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record ResetPasswordRequest(
        [property: Required, EmailAddress] string Email,
        [property: Required] string Otp,
        [property: Required] string NewPassword);

}
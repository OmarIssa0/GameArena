using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    

public record ForgotPasswordRequest(
    [Required, EmailAddress] string Email);
}

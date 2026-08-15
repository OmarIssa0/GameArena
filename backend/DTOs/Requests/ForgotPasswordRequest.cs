using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    

public record ForgotPasswordRequest(
    [property: Required, EmailAddress] string Email);
}

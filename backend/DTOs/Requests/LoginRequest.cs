using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);
}

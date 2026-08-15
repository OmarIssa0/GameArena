using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    

public record LoginRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Password);
}

using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record RegisterRequest(
        [property: Required] string FirstName,
        [property: Required] string LastName,
        [property: Required] string UserName,
        [property: Required, EmailAddress] string Email,
        string? Password);
}

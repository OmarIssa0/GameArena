using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record UpdateProfileRequest(
        [property: Required] string FirstName,
        [property: Required] string LastName,
        [property: Required] string UserName,
        [property: Required, EmailAddress] string Email);
}
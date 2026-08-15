using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record UpdateProfileRequest(
        [Required] string FirstName,
        [Required] string LastName,
        [Required] string UserName,
        [Required, EmailAddress] string Email);
}
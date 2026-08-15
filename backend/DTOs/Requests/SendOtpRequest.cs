using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record SendOtpRequest(
        [Required, EmailAddress] string Email);
}

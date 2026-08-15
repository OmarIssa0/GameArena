using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record SendOtpRequest(
        [property: Required, EmailAddress] string Email);
}

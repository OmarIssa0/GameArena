using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record ChangePasswordRequest(
    [Required] string OldPassword,
    [Required] string NewPassword);
}

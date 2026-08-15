using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record ChangePasswordRequest(
    [property: Required] string OldPassword,
    [property: Required] string NewPassword);
}

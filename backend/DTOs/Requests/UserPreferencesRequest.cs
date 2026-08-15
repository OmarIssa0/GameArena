using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record UserPreferencesRequest(
        [property: Required] string Preferences = "{}");
}

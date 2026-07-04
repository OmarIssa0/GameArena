using backend.Enums;

namespace backend.DTOs.Requests
{
    public class UserFilterRequest
    {
        public string? Name { get; set; }
        public UserStatus UserStatus { get; set; } = UserStatus.All;
    }
}

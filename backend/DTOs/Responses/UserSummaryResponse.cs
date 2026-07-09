using backend.Enums;

namespace backend.DTOs.Responses
{
    public class UserSummaryResponse
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserStatus Status { get; set; }
    }
}

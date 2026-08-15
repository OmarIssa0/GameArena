namespace backend.DTOs.Responses
{
    public sealed record FriendRequestReceivedResponse
    {
        public Guid SenderId { get; init; }
        public string SenderUserName { get; init; } = string.Empty;
        public string SenderFirstName { get; init; } = string.Empty;
        public string SenderLastName { get; init; } = string.Empty;
        public DateTime SentAt { get; init; }
    }
}
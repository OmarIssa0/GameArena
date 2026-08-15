namespace backend.DTOs.Responses
{
    public sealed record MessageResponse
    {
        public Guid SenderId { get; init; }
        public Guid ReceiverId { get; init; }
        public string Content { get; init; } = string.Empty;
        public DateTime SentAt { get; init; } = DateTime.UtcNow;
        public bool IsRead { get; init; }
    }
}
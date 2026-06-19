using backend.Enums;

namespace backend.Domain
{
    public class MatchHistory
    {
        public Guid Id { get; set; }
        public string RoomId { get; set; } = string.Empty;
        public GamesKind GameType { get; set; }
        public string? WinnerId { get; set; }
        public string? Status { get; set; }
        public string Player1Id { get; set; } = string.Empty;
        public string Player2Id { get; set; } = string.Empty;
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}

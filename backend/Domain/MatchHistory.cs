using backend.Enums;

namespace backend.Domain
{
    public class MatchHistory
    {
        public Guid Id { get; set; }
        public string RoomId { get; set; } = string.Empty;
        public GamesKind GameType { get; set; }
        public Guid? WinnerId { get; set; }
        public User Winner { get; set; } = null!;
        public MatchStatus? Status { get; set; }
        public Guid? Player1Id { get; set; }
        public User Player1 { get; set; } = null!;
        public Guid? Player2Id { get; set; }
        public User Player2 { get; set; } = null!;
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}

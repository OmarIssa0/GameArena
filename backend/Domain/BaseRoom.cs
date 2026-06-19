using backend.Enums;

namespace backend.Domain
{
    public abstract class BaseGameRoom
    {
        // data vars
        public string RoomId { get; set; } = Guid.NewGuid().ToString();
        public string? Player1Id { get; set; }
        public string? Player2Id { get; set; }
        public string? Player1Username { get; set; }
        public string? Player2Username { get; set; }
        public bool IsFull { get; set; } = false;
        public bool IsFinished { get; set; } = false;
        public GamesKind GameType { get; }
        protected BaseGameRoom(GamesKind gameType)
        {
            GameType = gameType;
        }

        // methods
        public abstract void UpdatePhysics(float deltaTime);
        public abstract object GetStatePayload();
        public abstract void ProcessInput(string playerId, string inputType, object payload);
    }

}

using System.Text.Json;
using backend.Enums;

namespace backend.Domain
{
    public class RockPaperScissors : BaseGameRoom
    {
        public RockPaperScissors() : base(GamesKind.RockPaperScissors) { }
        private readonly Lock _lock = new();
        private string[] choices = ["Rock", "Paper", "Scissors"];
        public string? Player1Choice { get; set; }
        public string? Player2Choice { get; set; }

        public override void ResetForNewRound()
        {
            base.ResetForNewRound();
            Player1Choice = null;
            Player2Choice = null;
        }

        public override object GetStatePayload() => new
        {
            roomId = RoomId,
            gameType = GameType,
            currentTurnPlayerId = CurrentTurnPlayerId,
            winnerPlayerId = WinnerPlayerId,
            isFinished = IsFinished,
            hasStarted = HasStarted,
            isFull = IsFull,
            isPrivate = IsPrivate,
            isBotGame = IsBotGame,
            player1Id = Player1Id,
            player1Username = Player1Username,
            player2Id = Player2Id,
            player2Username = Player2Username,
            score = Score,
            winScore = 3,
            player1Score = Score[0],
            player2Score = Score[1],
            boardWidth = 1,
            boardHeight = 1,
            tickRateHz = 0,
            player1Choice = Player1Choice,
            player2Choice = Player2Choice
        };

        public override void HandleAction(string playerId, JsonElement action)
        {
           lock (_lock)
            {
                if (action.ValueKind != JsonValueKind.Object
                    || !action.TryGetProperty("type", out var typeProp)
                    || typeProp.GetString() != "MAKE_MOVE"
                    || !action.TryGetProperty("choice", out var choiceProp))
                    return;

                var choice = choiceProp.GetString();
                if (
                    WinnerPlayerId != null
                    || !IsFull
                    || playerId != CurrentTurnPlayerId
                    || (playerId != Player1Id && playerId != Player2Id)
                    || !choices.Contains(choice)
                )
                    return;

                if (playerId == Player1Id)
                {
                    Player1Choice = choice;
                    CurrentTurnPlayerId = Player2Id;
                }
                else if (playerId == Player2Id)
                {
                    Player2Choice = choice;
                    DetermineWinner();
                }
            }
        }

        public override void MakeBotMove()
        {
            lock (_lock)
            {
                if (!IsBotGame || IsFinished || !HasStarted) return;
                bool botIsP1 = Player1Id == "__BOT__";
                bool botIsP2 = Player2Id == "__BOT__";
                if (!botIsP1 && !botIsP2) return;
                var botChoice = new Random().Next(0, 3);
                if (botIsP1)
                {
                    Player1Choice = choices[botChoice];
                    CurrentTurnPlayerId = Player2Id;
                }
                else if (botIsP2)
                {
                    Player2Choice = choices[botChoice];
                    DetermineWinner();
                }
            }

        }
        private void DetermineWinner()
        {
            if (Player1Choice == Player2Choice)
            {
                CompleteRound("");
                return;
            }

            if ((Player1Choice == "Rock" && Player2Choice == "Scissors") ||
                (Player1Choice == "Paper" && Player2Choice == "Rock") ||
                (Player1Choice == "Scissors" && Player2Choice == "Paper"))
            {
                CompleteRound(Player1Id);
            }
            else
            {
                CompleteRound(Player2Id);
            }
        }
    }
}

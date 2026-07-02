using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class TicTacToeRoom : BaseGameRoom
{
    public TicTacToeRoom() : base(GamesKind.TicTacToe) { }
    public string[] Board { get; set; } = new string[9];
    public string CurrentTurnPlayerId { get; set; } = "";
    public override void UpdatePhysics(float deltaTime) { }
    public override object GetStatePayload() => new
    {
        roomId = RoomId,
        board = Board,
        currentTurnPlayerId = CurrentTurnPlayerId,
        winnerPlayerId = WinnerPlayerId,
        winnerSymbol = WinnerSymbol,
        isFinished = IsFinished,
        hasStarted = HasStarted,
        isFull = IsFull,
        isPrivate = IsPrivate,
        player1Id = Player1Id,
        player1Username = Player1Username,
        player2Id = Player2Id,
        player2Username = Player2Username
    };

    public override void ProcessInput(string playerId, string inputType, object payload)
    {
        if (
            IsFinished 
            || !IsFull 
            || inputType != "MAKE_MOVE" 
            || playerId != CurrentTurnPlayerId 
            || !int.TryParse(payload.ToString(), out int cell) 
            || cell < 0 
            || cell > 8 
            || !string.IsNullOrEmpty(Board[cell])
        )
            return;

        Board[cell] = playerId == Player1Id ? "X" : "O";

        if (GameHelper.CheckWinTicTacTao(Board))
        {
            IsFinished = true;
            WinnerPlayerId = playerId;
            WinnerSymbol = Board[cell];
            return;
        }

        if (Board.All(x => !string.IsNullOrEmpty(x)))
        {
            IsFinished = true;
            return;
        }

        CurrentTurnPlayerId =
            playerId == Player1Id 
            ? Player2Id! 
            : Player1Id!;
    }
}
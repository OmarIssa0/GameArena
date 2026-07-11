using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class TicTacToeRoom : BaseGameRoom
{
    private readonly Lock _lock = new();

    public TicTacToeRoom() : base(GamesKind.TicTacToe) { }
    public string[] Board { get; set; } = [.. Enumerable.Repeat(".", 9)];
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
        isBotGame = IsBotGame,
        player1Id = Player1Id,
        player1Username = Player1Username,
        player2Id = Player2Id,
        player2Username = Player2Username
    };

    public override void HandleAction(string playerId, JsonElement action)
    {
        lock (_lock)
        {
            if (action.ValueKind != JsonValueKind.Object
                || !action.TryGetProperty("type", out var typeProp)
                || typeProp.GetString() != "MAKE_MOVE"
                || !action.TryGetProperty("cell", out var cellProp))
                return;

            var cell = cellProp.GetInt32();

            if (
                IsFinished
                || !IsFull
                || playerId != CurrentTurnPlayerId
                || (playerId != Player1Id && playerId != Player2Id)
                || cell < 0
                || cell > 8
                || Board[cell] != "."
            )
                return;

            Board[cell] = playerId == Player1Id ? "X" : "O";

            if (GameHelper.CheckWinTicTacToe(Board))
            {
                IsFinished = true;
                WinnerPlayerId = playerId;
                WinnerSymbol = Board[cell];
                return;
            }

            if (Board.All(x => x != "."))
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

    public override void MakeBotMove()
    {
        lock (_lock)
        {
            if (IsFinished || CurrentTurnPlayerId == null) return;

            var botId = Player1Id == "__BOT__" ? Player1Id : Player2Id;
            if (CurrentTurnPlayerId != botId) return;

            var botSymbol = botId == Player1Id ? "X" : "O";
            var botMove = TicTacToeMinimax.GetBestMove(Board, botSymbol);
            if (botMove < 0) return;

            Board[botMove] = botSymbol;

            if (GameHelper.CheckWinTicTacToe(Board))
            {
                IsFinished = true;
                WinnerPlayerId = botId;
                WinnerSymbol = Board[botMove];
                return;
            }

            if (Board.All(x => x != "."))
            {
                IsFinished = true;
                return;
            }

            CurrentTurnPlayerId = botId == Player1Id ? Player2Id! : Player1Id!;
        }
    }

    public override void OnPlayerDisconnected(string disconnectedPlayerId)
    {
        base.OnPlayerDisconnected(disconnectedPlayerId);
        WinnerSymbol = WinnerPlayerId == Player1Id ? "X" : "O";
    }
}

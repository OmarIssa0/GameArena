using backend.Enums;
using System.Text.Json;

namespace backend.Domain
{
    public sealed class ConnectFourRoom : BaseGameRoom
    {
        private readonly Lock _lock = new();

        public const int Cols = 7;
        public const int Rows = 6;
        public int[][] Board { get; set; } = Enumerable.Range(0, Cols).Select(_ => new int[Rows]).ToArray();

        public ConnectFourRoom() : base(GamesKind.ConnectFour) { }

        public override object GetStatePayload() => new
        {
            roomId = RoomId,
            gameType = GameType,
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
            player2Username = Player2Username,
            score = Score,
            boardWidth = Cols,
            boardHeight = Rows,
            winScore = 4,
            player1Score = Score[0],
            player2Score = Score[1],
            tickRateHz = 0
        };

        public override void ResetForNewRound()
        {
            base.ResetForNewRound();
            Board = Enumerable.Range(0, Cols).Select(_ => new int[Rows]).ToArray();
        }

        private static bool TryParseAction(JsonElement action, out int col)
        {
            col = -1;
            if (action.ValueKind != JsonValueKind.Object) return false;
            if (!action.TryGetProperty("type", out var type) || !type.ValueEquals("place")) return false;
            if (!action.TryGetProperty("col", out var column)) return false;
            return column.TryGetInt32(out col) && col >= 0 && col < Cols;
        }

        private int CountDirection(int col, int row, int dCol, int dRow, int piece)
        {
            int count = 0;
            int currentCol = col + dCol;
            int currentRow = row + dRow;
            while (currentCol >= 0 && currentCol < Cols && currentRow >= 0 && currentRow < Rows && Board[currentCol][currentRow] == piece)
            {
                count++;
                currentCol += dCol;
                currentRow += dRow;
            }
            return count;
        }

        private bool CheckWinner(int col, int row, int piece)
        {
            int[][] directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            foreach (var direction in directions)
            {
                int count = 1;
                count += CountDirection(col, row, direction[0], direction[1], piece);
                count += CountDirection(col, row, -direction[0], -direction[1], piece);
                if (count >= 4)
                    return true;
            }
            return false;
        }

        private bool TryGetAvailableRow(int col, out int row)
        {
            for (row = Rows - 1; row >= 0; row--)
                if (Board[col][row] == 0) return true;
            row = -1;
            return false;
        }

        private bool IsBoardFull()
        {
            for (int col = 0; col < Cols; col++)
                if (Board[col][0] == 0) return false;
            return true;
        }

        public override void HandleAction(string playerId, JsonElement action)
        {
            lock (_lock)
            {
                if (WinnerPlayerId != null
                    || !IsFull
                    || playerId != CurrentTurnPlayerId
                    || (playerId != Player1Id && playerId != Player2Id)
                    || !TryParseAction(action, out int col)
                    || !TryGetAvailableRow(col, out int row))
                    return;

                int piece = playerId == Player1Id ? 1 : 2;
                Board[col][row] = piece;

                if (CheckWinner(col, row, piece))
                {
                    WinnerPlayerId = playerId;
                    WinnerSymbol = piece == 1 ? "🔴" : "🟡";
                    if (playerId == Player1Id) Score[0]++; else Score[1]++;
                    return;
                }

                if (IsBoardFull())
                {
                    WinnerPlayerId = "";
                    return;
                }

                CurrentTurnPlayerId = playerId == Player1Id ? Player2Id! : Player1Id!;
            }
        }

        public override void MakeBotMove()
        {
            lock (_lock)
            {
                if (!IsBotGame || WinnerPlayerId != null || CurrentTurnPlayerId == null) return;
                var botId = Player1Id == "__BOT__" ? Player1Id : Player2Id;
                if (CurrentTurnPlayerId != botId) return;
                int piece = botId == Player1Id ? 1 : 2;

                List<int> availableColumns = [];
                for (int col = 0; col < Cols; col++)
                    if (Board[col][0] == 0)
                        availableColumns.Add(col);

                if (availableColumns.Count == 0) return;
                int randomCol = availableColumns[Random.Shared.Next(availableColumns.Count)];
                if (!TryGetAvailableRow(randomCol, out int row))
                    return;

                Board[randomCol][row] = piece;

                if (CheckWinner(randomCol, row, piece))
                {
                    WinnerPlayerId = botId;
                    WinnerSymbol = piece == 1 ? "🔴" : "🟡";
                    if (botId == Player1Id) Score[0]++; else Score[1]++;
                    return;
                }

                if (IsBoardFull())
                {
                    WinnerPlayerId = "";
                    return;
                }

                CurrentTurnPlayerId = botId == Player1Id ? Player2Id! : Player1Id!;
            }
        }

        public override void OnPlayerDisconnected(string disconnectedPlayerId)
        {
            base.OnPlayerDisconnected(disconnectedPlayerId);
            WinnerSymbol = WinnerPlayerId == Player1Id ? "🔴" : "🟡";
        }
    }
}

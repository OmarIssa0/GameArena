namespace backend.Utils
{
    public static class TicTacToeMinimax
    {
        public static int GetBestMove(string[] board, string aiSymbol)
        {
            int bestScore = int.MinValue;
            int bestMove = -1;
            string humanSymbol = aiSymbol == "X" ? "O" : "X";

            for (int i = 0; i < 9; i++)
            {
                if (board[i] != ".") continue;

                board[i] = aiSymbol;
                int score = Minimax(board, 0, false, aiSymbol, humanSymbol);
                board[i] = ".";

                if (score > bestScore)
                {
                    bestScore = score;
                    bestMove = i;
                }
            }

            return bestMove;
        }

        private static int Minimax(string[] board, int depth, bool isMaximizing, string aiSymbol, string humanSymbol)
        {
            if (GameHelper.CheckWinTicTacToe(board, aiSymbol)) return 10 - depth;
            if (GameHelper.CheckWinTicTacToe(board, humanSymbol)) return depth - 10;
            if (IsBoardFull(board)) return 0;

            if (isMaximizing)
            {
                int bestScore = int.MinValue;
                for (int i = 0; i < 9; i++)
                {
                    if (board[i] != ".") continue;
                    board[i] = aiSymbol;
                    int score = Minimax(board, depth + 1, false, aiSymbol, humanSymbol);
                    board[i] = ".";
                    if (score > bestScore) bestScore = score;
                }
                return bestScore;
            }
            else
            {
                int bestScore = int.MaxValue;
                for (int i = 0; i < 9; i++)
                {
                    if (board[i] != ".") continue;
                    board[i] = humanSymbol;
                    int score = Minimax(board, depth + 1, true, aiSymbol, humanSymbol);
                    board[i] = ".";
                    if (score < bestScore) bestScore = score;
                }
                return bestScore;
            }
        }

        private static bool IsBoardFull(string[] board)
        {
            return board.All(cell => cell != ".");
        }
    }
}

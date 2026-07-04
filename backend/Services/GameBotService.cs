using backend.Services.Interface;
using backend.Utils;

namespace backend.Services
{
    public class GameBotService : IGameBotService
    {
        public int GetBotMove(string[] board, string botSymbol)
        {
            return TicTacToeMinimax.GetBestMove(board, botSymbol);
        }
    }
}

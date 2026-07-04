namespace backend.Services.Interface
{
    public interface IGameBotService
    {
        int GetBotMove(string[] board, string botSymbol);
    }
}

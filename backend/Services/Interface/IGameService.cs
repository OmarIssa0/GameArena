using backend.Domain;

namespace backend.Services.Interface
{
    public interface IGameService
    {
         Task SaveMatchHistoryAsync(BaseGameRoom room);
    }
}

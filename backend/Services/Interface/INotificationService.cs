using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface INotificationService
    {
        Task<NotificationCountersResponse> GetCountersAsync(Guid userId);
        Task SendCountersAsync(Guid userId);
    }
}

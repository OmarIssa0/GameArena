namespace backend.Services.Interface
{
    public interface INotificationService
    {
        Task SendToUserAsync(string userId, string method, object? arg);
        Task SendToGroupAsync(string groupName, string method, object? arg);
    }
}

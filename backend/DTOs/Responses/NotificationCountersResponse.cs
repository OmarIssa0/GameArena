namespace backend.DTOs.Responses
{
    public class NotificationCountersResponse
    {
        public int ReceivedFriendRequests { get; set; }
        public int SentFriendRequests { get; set; }
        public int UnreadMessages { get; set; }
        public int Friends { get; set; }
    }
}
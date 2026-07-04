using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Services.Interface
{
    public interface IFriendService
    {
        Task SendFriendRequestAsync(Guid senderId, Guid receiverId);
        Task AcceptFriendRequestAsync(Guid userId, Guid senderId);
        Task DeclineFriendRequestAsync(Guid userId, Guid senderId);
        Task<List<UserResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter);
        Task<List<FriendRequestReceivedResponse>> GetFriendRequestsAsync(Guid userId);
        Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId);

    }
}

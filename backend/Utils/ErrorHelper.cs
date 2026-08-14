using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Utils
{
public class ErrorResponse
{
    public ApiResponse<object> Value { get; set; } = null!;
    public int StatusCode { get; set; }
}

    public static class ErrorHelper
    {
        public static readonly IDictionary<ErrorCode, int> Errors =
         new Dictionary<ErrorCode, int>
         {
             // AUTH

             [ErrorCode.InvalidCredentials] =
             401,

             [ErrorCode.Unauthorized] =
             401,

             [ErrorCode.TokenExpired] =
             401,

             [ErrorCode.EmailNotVerified] =
             401,

             [ErrorCode.RefreshTokenInvalid] =
             401,

             [ErrorCode.EmailAlreadyVerified] =
             400,

             // EMAIL / OTP

             [ErrorCode.EmailNotFound] =
             404,

             [ErrorCode.EmailAlreadyExists] =
             409,

             [ErrorCode.UsernameAlreadyExists] =
             409,

             [ErrorCode.OtpInvalid] =
             400,

             [ErrorCode.OtpExpired] =
             400,

             [ErrorCode.RateLimited] =
             429,

             // USER

             [ErrorCode.UserNotFound] =
             404,

              [ErrorCode.AlreadyBlocked] =
              400,

              [ErrorCode.NotBlocked] =
              400,

              [ErrorCode.CannotSelfBlock] =
              400,

              [ErrorCode.UserBlockedYou] =
              403,

              [ErrorCode.YouBlockedUser] =
              403,

             // FRIEND SYSTEM

             [ErrorCode.RequestAlreadyExists] =
             409,

             [ErrorCode.AlreadyFriends] =
             409,

             [ErrorCode.ReceiverHasAlreadySentRequest] =
             409,

             [ErrorCode.FriendRequestNotFound] =
             404,

             [ErrorCode.IsNotFriend] =
             400,

             [ErrorCode.RequestAlreadyProcessed] =
             409,

             // GAME

             [ErrorCode.RoomNotFound] =
             404,

             [ErrorCode.PlayerNotFound] =
             404,

             [ErrorCode.InvalidGameType] =
             400,

             [ErrorCode.InvalidRoomId] =
             400,

             // VALIDATION / REQUEST

             [ErrorCode.InvalidRequest] =
             400,

             [ErrorCode.ValidationError] =
             400,

             // SYSTEM

             [ErrorCode.ServerError] =
             500,

             [ErrorCode.None] =
             500
         };
        public static ErrorResponse GetErrorResponse(Exception ex)
        {
            if (ex is not AppException appEx)
            {
                return Create(
                    500,
                    ErrorCode.ServerError
                );
            }

            if (!Errors.TryGetValue(appEx.ErrorCode, out var statusCode))
            {
                throw new Exception($"Missing ErrorCode mapping: {appEx.ErrorCode}");
            }

            return Create(
                statusCode,
                appEx.ErrorCode
            );
        }

        private static ErrorResponse Create(
            int statusCode,
            ErrorCode code)
        {
            return new ErrorResponse
            {
                StatusCode = statusCode,
                Value = new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = code,
                    Data = null
                }
            };
        }
    }
}
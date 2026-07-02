using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace backend.Hubs
{
    [Authorize]
    public class GameHub(IGameService _gameService, IHubContext<ChatHub> _chatHubContext) : Hub
    {
        private static readonly Lock _matchLock = new();
        public static readonly ConcurrentDictionary<string, BaseGameRoom> Rooms = new();
        public static readonly ConcurrentDictionary<string, string> PlayerToRoom = new();


        public override async Task OnDisconnectedAsync(Exception? exception)
        {

            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (PlayerToRoom.TryRemove(playerId, out var roomId) && Rooms.TryGetValue(roomId, out var room))
            {
                    Rooms.TryRemove(roomId, out _);

                    var opponentId = room.Player1Id == playerId ? room.Player2Id : room.Player1Id;
                    if (opponentId != null)
                    {
                        PlayerToRoom.TryRemove(opponentId, out _);
                    }

                    if (!room.IsFinished && room.IsFull)
                    {
                        room.IsFinished = true;
                        if (room is TicTacToeRoom xoRoom)
                        {
                            xoRoom.WinnerPlayerId = opponentId;
                            xoRoom.WinnerSymbol = opponentId == xoRoom.Player1Id ? "X" : "O";
                            await _gameService.SaveMatchHistoryAsync(xoRoom);
                        }
                    }

                    await Clients.Group(roomId)
                        .SendAsync("OpponentDisconnected");
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task FindMatch(GamesKind gameType)
        {
            string playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            if ( PlayerToRoom.TryGetValue(playerId,out var existingRoomId)
                && Rooms.TryGetValue(existingRoomId, out var existingRoom)
                && !existingRoom.IsFinished
                )
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, existingRoomId);
                await Clients.Caller.SendAsync("gameState", existingRoom.GetStatePayload());
                return;
            }
            BaseGameRoom? room = null;

            lock (_matchLock)
            {
                var openRoom = Rooms.Values.FirstOrDefault(r =>
                     r.GameType == gameType &&
                     !r.IsFull &&
                     !r.IsPrivate &&
                     r.Player1Id != playerId);

                if (openRoom != null)
                {
                    openRoom.Player2Id = playerId;
                    openRoom.Player2Username = Context.User?.Identity?.Name ?? "Player 2";
                    openRoom.IsFull = true;

                    if (openRoom is TicTacToeRoom xo)
                        xo.CurrentTurnPlayerId = openRoom.Player1Id!;

                    room = openRoom;
                }
                else
                {
                    room = gameType switch
                    {
                        GamesKind.TicTacToe => new TicTacToeRoom(),
                        _ => throw new AppException(ErrorCode.InvalidGameType)
                    };

                    room.Player1Id = playerId;
                    room.Player1Username = Context.User?.Identity?.Name ?? "Player 1";
                    Rooms[room.RoomId] = room;
                }

                PlayerToRoom[playerId] = room.RoomId;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);

            await Clients.Group(room.RoomId)
                .SendAsync("gameState", room.GetStatePayload());
        }

        public async Task SendAction(string inputType, string payload)
        {

            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            if ( !PlayerToRoom.TryGetValue(playerId, out var roomId)
                || !Rooms.TryGetValue(roomId, out var room) 
                || room.IsFinished 
                || (room.Player1Id != playerId && room.Player2Id != playerId)
                || (room is TicTacToeRoom xoRoom && xoRoom.CurrentTurnPlayerId != playerId)
                ) return;


            room.ProcessInput(playerId, inputType, payload);

            await Clients.Group(roomId)
                        .SendAsync("gameState", room.GetStatePayload());

            if (room is TicTacToeRoom game && game.IsFinished)
            {
                await _gameService.SaveMatchHistoryAsync(game);

                Rooms.TryRemove(roomId, out _);

                if (game.Player1Id != null)
                    PlayerToRoom.TryRemove(game.Player1Id, out _);

                if (game.Player2Id != null)
                    PlayerToRoom.TryRemove(game.Player2Id, out _);
            }
        }

        public Task<object?> GetCurrentState()
        {

            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if ( PlayerToRoom.TryGetValue(playerId, out var roomId) 
                && Rooms.TryGetValue(roomId, out var room))
            {
                return Task.FromResult<object?>(room.GetStatePayload());
            }

            return Task.FromResult<object?>(null);
        }

        public async Task CancelSearch()
        {

            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (PlayerToRoom.TryGetValue(playerId, out var roomId) &&
                Rooms.TryGetValue(roomId, out var room))
            {
                if (!room.IsFull)
                {
                    Rooms.TryRemove(roomId, out _);
                    PlayerToRoom.TryRemove(playerId, out _);
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
                }
            }
        }
        public async Task StartGame(string friendId, GamesKind gameKind)
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            if ( !PlayerToRoom.TryGetValue(playerId, out var roomId)
                || !Rooms.TryGetValue(roomId, out var room)
                || room.GameType != gameKind
                || room.Player1Id != playerId
                || room.Player2Id != friendId) return;

                room.HasStarted = true;
                await Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
        }
        
        public async Task InviteFriend(string friendId, GamesKind gameType)
        {

            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            string username = Context.User?.Identity?.Name ?? "Player";

            if (PlayerToRoom.TryGetValue(playerId, out var existingRoomId) 
                && Rooms.TryGetValue(existingRoomId, out var existingRoom) 
                && !existingRoom.IsFinished)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, existingRoomId);
                await Clients.Caller.SendAsync("gameState", existingRoom.GetStatePayload());
                return;
            }

            var room = gameType switch
            {
                GamesKind.TicTacToe => new TicTacToeRoom
                {
                    Player1Id = playerId,
                    Player1Username = username,
                    RoomId = Guid.NewGuid().ToString("N"),
                    IsPrivate = true,
                    InvitedPlayerId = friendId,
                },
                _ => throw new AppException(ErrorCode.InvalidGameType)
            };
            Rooms[room.RoomId] = room;
            PlayerToRoom[playerId] = room.RoomId;
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            await Clients.Group(room.RoomId).SendAsync("gameState", room.GetStatePayload());
            await _chatHubContext.Clients.User(friendId).SendAsync("GameInvite", new
            {
                roomId = room.RoomId,
                gameType,
                inviterId = playerId,
                inviterName = username
            });
        }

        public async Task AcceptInvite(string roomId)
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            if(roomId == null) throw new AppException(ErrorCode.InvalidRoomId);
            var username = Context.User?.Identity?.Name ;

            if (Rooms.TryGetValue(roomId, out var room)
                && !room.IsFull
                && room.Player1Id != playerId
                && (room.InvitedPlayerId is null 
                    || room.InvitedPlayerId == playerId))
            {
                room.Player2Id = playerId;
                room.Player2Username = username;
                room.IsFull = true;
                if (room.Player1Id != null && room is TicTacToeRoom xo) xo.CurrentTurnPlayerId = room.Player1Id;
                PlayerToRoom[playerId] = roomId;
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                await Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
            }
        }
    }
}
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatWebSignalR.Hubs
{
    [Authorize]
    public class GameHub : Hub
    {
        private static readonly object _matchLock = new();
        public static readonly ConcurrentDictionary<string, BaseGameRoom> Rooms = new();
        public static readonly ConcurrentDictionary<string, string> PlayerToRoom = new();

        private readonly IGameService _gameService;

        public GameHub(IGameService gameService)
        {
            _gameService = gameService;
        }

        public async Task FindMatch(GamesKind gameType)
        {
            string playerId = Context.UserIdentifier
                ?? throw new HubException("Unauthorized user");

            BaseGameRoom? room = null;

            lock (_matchLock)
            {
                var openRoom = Rooms.Values.FirstOrDefault(r =>
                    r.GameType == gameType && !r.IsFull && r.Player1Id != playerId);

                if (openRoom != null)
                {
                    openRoom.Player2Id = playerId;
                    openRoom.Player2Username = Context.User?.Identity?.Name ?? "Player 2";
                    openRoom.IsFull = true;

                    if (openRoom is TicTacTaoRoom xo)
                        xo.CurrentTurnPlayerId = openRoom.Player1Id!;

                    room = openRoom;
                }
                else
                {
                    room = gameType switch
                    {
                        GamesKind.TicTacTao => new TicTacTaoRoom(),
                        _ => throw new ArgumentException("Unknown Game Type")
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
            var playerId = Context.UserIdentifier;

            if (playerId == null) return;

            if (!PlayerToRoom.TryGetValue(playerId, out var roomId))
                return;

            if (!Rooms.TryGetValue(roomId, out var room))
                return;

            if (room.IsFinished)
                return;

            if (room.Player1Id != playerId && room.Player2Id != playerId)
                return;

            if (room is TicTacTaoRoom xoRoom &&
                xoRoom.CurrentTurnPlayerId != playerId)
                return;

            room.ProcessInput(playerId, inputType, payload);

            await Clients.Group(roomId)
                        .SendAsync("gameState", room.GetStatePayload());

            if (room is TicTacTaoRoom game && game.IsFinished)
            {
                await _gameService.SaveMatchHistoryAsync(game);

                Rooms.TryRemove(roomId, out _);

                if (game.Player1Id != null)
                    PlayerToRoom.TryRemove(game.Player1Id, out _);

                if (game.Player2Id != null)
                    PlayerToRoom.TryRemove(game.Player2Id, out _);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var playerId = Context.UserIdentifier;

            if (playerId != null &&
                PlayerToRoom.TryRemove(playerId, out var roomId))
            {
                if (Rooms.TryGetValue(roomId, out var room))
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
                        if (room is TicTacTaoRoom xoRoom)
                        {
                            xoRoom.WinnerPlayerId = opponentId;
                            xoRoom.WinnerSymbol = opponentId == xoRoom.Player1Id ? "X" : "O";
                            await _gameService.SaveMatchHistoryAsync(xoRoom);
                        }
                    }

                    await Clients.Group(roomId)
                        .SendAsync("OpponentDisconnected");
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
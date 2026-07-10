using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using System.Collections.Concurrent;

namespace backend.Services
{
    public class GameRoomService : IGameRoomService
    {
        private readonly ConcurrentDictionary<string, BaseGameRoom> _rooms = new();
        private readonly ConcurrentDictionary<string, string> _playerToRoom = new();
        private readonly Lock _matchLock = new();

        public (BaseGameRoom room, bool isNew) FindOrCreateRoom(GamesKind gameType, string playerId, string username)
        {
            lock (_matchLock)
            {
                var openRoom = _rooms.Values.FirstOrDefault(r =>
                    r.GameType == gameType && !r.IsFull && !r.IsPrivate && r.Player1Id != playerId);

                if (openRoom != null)
                {
                    openRoom.Player2Id = playerId;
                    openRoom.Player2Username = username;
                    openRoom.IsFull = true;
                    openRoom.CurrentTurnPlayerId = openRoom.Player1Id!;
                    _playerToRoom[playerId] = openRoom.RoomId;
                    return (openRoom, false);
                }

                BaseGameRoom room = gameType switch
                {
                    GamesKind.TicTacToe => new TicTacToeRoom(),
                    GamesKind.PingPong => new PingPongRoom(),
                    _ => throw new AppException(ErrorCode.InvalidGameType)
                };
                room.Player1Id = playerId;
                room.Player1Username = username;
                _rooms[room.RoomId] = room;
                _playerToRoom[playerId] = room.RoomId;
                return (room, true);
            }
        }

        public BaseGameRoom CreatePrivateRoom(GamesKind gameType, string playerId, string username, string invitedPlayerId)
        {
            BaseGameRoom room = gameType switch
            {
                GamesKind.TicTacToe => new TicTacToeRoom
                {
                    Player1Id = playerId,
                    Player1Username = username,
                    IsPrivate = true,
                    InvitedPlayerId = invitedPlayerId,
                },
                GamesKind.PingPong => new PingPongRoom
                {
                    Player1Id = playerId,
                    Player1Username = username,
                    IsPrivate = true,
                    InvitedPlayerId = invitedPlayerId,
                },
                _ => throw new AppException(ErrorCode.InvalidGameType)
            };
            _rooms[room.RoomId] = room;
            _playerToRoom[playerId] = room.RoomId;
            return room;
        }

        public bool TryGetRoom(string roomId, out BaseGameRoom? room)
            => _rooms.TryGetValue(roomId, out room);

        public bool TryRemoveRoom(string roomId)
            => _rooms.TryRemove(roomId, out _);

        public bool TryGetPlayerRoom(string playerId, out string? roomId)
            => _playerToRoom.TryGetValue(playerId, out roomId);

        public bool TryRemovePlayer(string playerId)
            => _playerToRoom.TryRemove(playerId, out _);

        public bool TryJoinRoom(string roomId, string playerId, string? username)
        {
            if (_rooms.TryGetValue(roomId, out var room)
                && !room.IsFull
                && room.Player1Id != playerId
                && room.InvitedPlayerId == playerId)
            {
                room.Player2Id = playerId;
                room.Player2Username = username;
                room.IsFull = true;
                if (room.Player1Id != null)
                    room.CurrentTurnPlayerId = room.Player1Id;
                _playerToRoom[playerId] = roomId;
                return true;
            }
            return false;
        }

        public void RemoveRoomAndPlayers(string roomId)
        {
            if (_rooms.TryRemove(roomId, out var room))
            {
                if (room.Player1Id != null)
                    _playerToRoom.TryRemove(room.Player1Id, out _);
                if (room.Player2Id != null)
                    _playerToRoom.TryRemove(room.Player2Id, out _);
            }
        }
    }
}

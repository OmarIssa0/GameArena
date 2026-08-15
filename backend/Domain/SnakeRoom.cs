using System.Text.Json;
using backend.Enums;

namespace backend.Domain
{
    public sealed class SnakeRoom : BaseGameRoom
    {
        private readonly Lock _lock = new();

        public static readonly int BoardWidth = 30;
        public static readonly int BoardHeight = 20;
        private const int InitialLength = 3;
        private const int GameTickIntervalMs = 100;

        private const string ActionChangeDirection = "CHANGE_DIRECTION";

        public int Score1 { get; private set; }
        public int Score2 { get; private set; }
        public Point Food { get; private set; }
        public DirectionEnum Dir1 { get; private set; } = DirectionEnum.Right;
        public DirectionEnum Dir2 { get; private set; } = DirectionEnum.Left;

        private readonly LinkedList<Point> _snake1 = new();
        private readonly LinkedList<Point> _snake2 = new();

        private DirectionEnum? _pending1;
        private DirectionEnum? _pending2;
        private bool _alive1 = true;
        private bool _alive2 = true;

        public SnakeRoom() : base(GamesKind.Snake) { }

        public override bool NeedsGameLoop => true;
        public override int TickIntervalMs => GameTickIntervalMs;

        public override void Tick()
        {
            lock (_lock)
            {
                if (WinnerPlayerId != null || !HasStarted) return;
                if (_snake1.Count == 0 || _snake2.Count == 0) return;

                ApplyDirections();
                MovePlayers();
                HandleFood();
                HandleCollisions();
                ResolveWinner();
            }
        }

        private void ApplyDirections()
        {
            if (_pending1.HasValue && IsValidTurn(Dir1, _pending1.Value)) Dir1 = _pending1.Value;
            _pending1 = null;

            if (_pending2.HasValue && IsValidTurn(Dir2, _pending2.Value)) Dir2 = _pending2.Value;
            _pending2 = null;
        }

        private void MovePlayers()
        {
            if (_alive1) MoveSnake(_snake1, Dir1);
            if (_alive2) MoveSnake(_snake2, Dir2);
        }

        private bool MoveSnake(LinkedList<Point> snake, DirectionEnum dir)
        {
            var head = snake.First!.Value;
            var next = head.Move(dir);

            snake.AddFirst(next);

            if (next.Equals(Food)) return true;

            snake.RemoveLast();
            return false;
        }

        private void HandleFood()
        {
            bool ate1 = false, ate2 = false;

            if (_alive1 && _snake1.First!.Value.Equals(Food)) { ate1 = true; Score1++; }
            if (_alive2 && _snake2.First!.Value.Equals(Food)) { ate2 = true; Score2++; }

            if (ate1 || ate2) SpawnFood();
        }

        private void SpawnFood()
        {
            while (true)
            {
                var p = new Point(Random.Shared.Next(BoardWidth), Random.Shared.Next(BoardHeight));
                if (!_snake1.Contains(p) && !_snake2.Contains(p))
                {
                    Food = p;
                    return;
                }
            }
        }

        private void HandleCollisions()
        {
            if (!_alive1 && !_alive2) return;

            var h1 = _snake1.First!.Value;
            var h2 = _snake2.First!.Value;

            if (_alive1 && IsDead(h1, _snake1, _snake2, h2)) _alive1 = false;
            if (_alive2 && IsDead(h2, _snake2, _snake1, h1)) _alive2 = false;

            if (h1.Equals(h2)) _alive1 = _alive2 = false;
        }

        private bool IsDead(Point head, LinkedList<Point> me, LinkedList<Point> enemy, Point otherHead)
        {
            var cur = me.First!.Next;
            while (cur != null)
            {
                if (cur.Value.Equals(head)) return true;
                cur = cur.Next;
            }

            cur = enemy.First;
            while (cur != null)
            {
                if (cur.Value.Equals(head)) return true;
                cur = cur.Next;
            }

            return false;
        }

        private void ResolveWinner()
        {
            if (!_alive1 && !_alive2) CompleteRound("");
            else if (!_alive1) CompleteRound(Player2Id);
            else if (!_alive2) CompleteRound(Player1Id);
        }

        public override void HandleAction(string playerId, JsonElement action)
        {
            lock (_lock)
            {
                if (Player1Id != playerId && Player2Id != playerId) return;
                if (_snake1.Count == 0 || _snake2.Count == 0) return;
                if (!TryParseAction(action, out var dir)) return;

                if (playerId == Player1Id && IsValidTurn(Dir1, dir)) _pending1 = dir;
                else if (playerId == Player2Id && IsValidTurn(Dir2, dir)) _pending2 = dir;
            }
        }

        private static bool TryParseAction(JsonElement action, out DirectionEnum dir)
        {
            dir = default;
            if (action.ValueKind != JsonValueKind.Object) return false;
            if (!action.TryGetProperty("type", out var t) || !t.ValueEquals(ActionChangeDirection)) return false;
            if (!action.TryGetProperty("direction", out var d)) return false;
            return Enum.TryParse<DirectionEnum>(d.GetString(), true, out dir);
        }

        private static bool IsValidTurn(DirectionEnum cur, DirectionEnum next)
            => (cur, next) is not (DirectionEnum.Up, DirectionEnum.Down)
                and not (DirectionEnum.Down, DirectionEnum.Up)
                and not (DirectionEnum.Left, DirectionEnum.Right)
                and not (DirectionEnum.Right, DirectionEnum.Left);

        public override void MakeBotMove()
        {
            lock (_lock)
            {
                if (!IsBotGame || IsFinished || !HasStarted || !_alive2) return;
                if (_snake2.Count == 0) return;

                var head = _snake2.First!.Value;
                var best = Dir2;
                var bestScore = int.MinValue;

                foreach (var d in Enum.GetValues<DirectionEnum>())
                {
                    if (!IsValidTurn(Dir2, d)) continue;
                    var next = head.Move(d);
                    int s = ScoreMove(next);
                    if (s > bestScore) { bestScore = s; best = d; }
                }
                _pending2 = best;
            }
        }

        private int ScoreMove(Point p)
        {
            if (_snake1.Contains(p) || _snake2.Contains(p)) return int.MinValue;

            int dx = Math.Abs(p.X - Food.X);
            int dy = Math.Abs(p.Y - Food.Y);
            dx = Math.Min(dx, BoardWidth - dx);
            dy = Math.Min(dy, BoardHeight - dy);
            int dist = dx + dy;

            int s = (p.X == Food.X && p.Y == Food.Y) ? 1000 : 0;
            s -= dist;
            s += Math.Min(Math.Min(p.X, BoardWidth - 1 - p.X), Math.Min(p.Y, BoardHeight - 1 - p.Y)) * 2;
            return s;
        }

        public override void ResetForNewRound()
        {
            lock (_lock)
            {
                base.ResetForNewRound();
                Score1 = Score2 = 0;
                Dir1 = DirectionEnum.Right; Dir2 = DirectionEnum.Left;
                _pending1 = _pending2 = null;
                _alive1 = _alive2 = true;

                _snake1.Clear(); _snake2.Clear();

                int y = BoardHeight / 2;
                for (int i = 0; i < InitialLength; i++) _snake1.AddLast(new Point(2 - i, y));
                for (int i = 0; i < InitialLength; i++) _snake2.AddLast(new Point(BoardWidth - 3 + i, y));

                SpawnFood();
            }
        }

        public override object GetStatePayload() => new
        {
            roomId = RoomId,
            gameType = GameType,
            player1Id = Player1Id,
            player1Username = Player1Username,
            player2Id = Player2Id,
            player2Username = Player2Username,
            hasStarted = HasStarted,
            isFull = IsFull,
            isPrivate = IsPrivate,
            isBotGame = IsBotGame,
            isFinished = IsFinished,
            winnerPlayerId = WinnerPlayerId,
            currentTurnPlayerId = CurrentTurnPlayerId,
            boardWidth = BoardWidth,
            boardHeight = BoardHeight,
            food = Food,
            player1Snake = _snake1.ToArray(),
            player2Snake = _snake2.ToArray(),
            player1Direction = Dir1.ToString(),
            player2Direction = Dir2.ToString(),
            player1Score = Score1,
            player2Score = Score2,
            score = Score,
            winScore = 0,
            tickRateHz = 10
        };
    }

    public readonly record struct Point(int X, int Y)
    {
        public Point Move(DirectionEnum d) => d switch
        {
            DirectionEnum.Up => new(X, (Y - 1 + SnakeRoom.BoardHeight) % SnakeRoom.BoardHeight),
            DirectionEnum.Down => new(X, (Y + 1) % SnakeRoom.BoardHeight),
            DirectionEnum.Left => new((X - 1 + SnakeRoom.BoardWidth) % SnakeRoom.BoardWidth, Y),
            DirectionEnum.Right => new((X + 1) % SnakeRoom.BoardWidth, Y),
            _ => this
        };
    }

    
}

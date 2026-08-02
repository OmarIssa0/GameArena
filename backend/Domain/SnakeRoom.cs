using System.Text.Json;
using backend.Enums;

namespace backend.Domain
{
    public sealed class SnakeRoom : BaseGameRoom
    {
        private readonly Lock _lock = new();

        private const int DefaultBoardWidth = 30;
        private const int DefaultBoardHeight = 20;
        private const int InitialSnakeLength = 3;
        private const int TickRateHz = 10;
        private const int GameTickIntervalMs = 1000 / TickRateHz;

        private const string ActionChangeDirection = "CHANGE_DIRECTION";
        private const string DirectionUp = "UP";
        private const string DirectionDown = "DOWN";
        private const string DirectionLeft = "LEFT";
        private const string DirectionRight = "RIGHT";

        public int BoardWidth { get; } = DefaultBoardWidth;
        public int BoardHeight { get; } = DefaultBoardHeight;

        public int ScoreP1 { get; private set; } = 0;
        public int ScoreP2 { get; private set; } = 0;

        public (int X, int Y) FoodPosition { get; private set; }

        public Direction Player1Direction { get; private set; } = Direction.Right;
        public Direction Player2Direction { get; private set; } = Direction.Left;

        private readonly LinkedList<(int X, int Y)> _snake1 = new();
        private readonly LinkedList<(int X, int Y)> _snake2 = new();
        private readonly HashSet<int> _occupied = new();

        private Direction? _pendingDir1;
        private Direction? _pendingDir2;
        private bool _snake1Alive = true;
        private bool _snake2Alive = true;
        private bool _gameEndedThisTick = false;

        public SnakeRoom() : base(GamesKind.Snake) { }

        public override bool NeedsGameLoop => true;

        public override int TickIntervalMs => GameTickIntervalMs;

        public override void Tick()
        {
            lock (_lock)
            {
                if (WinnerPlayerId != null || !HasStarted)
                    return;

                ReadPendingDirections();
                MoveSnakes();
                DetectCollisions();
                DetectFood();
                DetectWinner();

                if (WinnerPlayerId != null && !_gameEndedThisTick)
                {
                    IsFinished = true;
                    _gameEndedThisTick = true;
                }
            }
        }

        private void ReadPendingDirections()
        {
            if (_pendingDir1.HasValue && IsValidTurn(Player1Direction, _pendingDir1.Value))
                Player1Direction = _pendingDir1.Value;
            _pendingDir1 = null;

            if (_pendingDir2.HasValue && IsValidTurn(Player2Direction, _pendingDir2.Value))
                Player2Direction = _pendingDir2.Value;
            _pendingDir2 = null;
        }

        private void MoveSnakes()
        {
            if (_snake1Alive)
                MoveSnake(_snake1, Player1Direction, ateFood: false);

            if (_snake2Alive)
                MoveSnake(_snake2, Player2Direction, ateFood: false);
        }

        private void MoveSnake(LinkedList<(int X, int Y)> snake, Direction dir, bool ateFood)
        {
            var head = snake.First!.Value;
            var nextHead = GetNextPosition(head, dir);

            snake.AddFirst(nextHead);
            _occupied.Add(ToKey(nextHead));

            if (!ateFood)
            {
                var tail = snake.Last!.Value;
                snake.RemoveLast();
                _occupied.Remove(ToKey(tail));
            }
        }

        private (int X, int Y) GetNextPosition((int X, int Y) head, Direction dir)
        {
            return dir switch
            {
                Direction.Up => (head.X, head.Y - 1),
                Direction.Down => (head.X, head.Y + 1),
                Direction.Left => (head.X - 1, head.Y),
                Direction.Right => (head.X + 1, head.Y),
                _ => head
            };
        }

        private void DetectCollisions()
        {
            var head1 = _snake1.First!.Value;
            var head2 = _snake2.First!.Value;

            bool dead1 = false;
            bool dead2 = false;

            if (_snake1Alive && IsWallCollision(head1))
                dead1 = true;

            if (_snake2Alive && IsWallCollision(head2))
                dead2 = true;

            if (_snake1Alive && IsSelfCollision(_snake1, head1))
                dead1 = true;

            if (_snake2Alive && IsSelfCollision(_snake2, head2))
                dead2 = true;

            if (_snake1Alive && IsEnemyCollision(_snake2, head1))
                dead1 = true;

            if (_snake2Alive && IsEnemyCollision(_snake1, head2))
                dead2 = true;

            bool headToHead = head1.Equals(head2);
            bool headSwap = _snake1Alive && _snake2Alive &&
                _snake1.First!.Next != null && _snake2.First!.Next != null &&
                head1.Equals(_snake2.First.Next.Value) &&
                head2.Equals(_snake1.First.Next.Value);

            if (headToHead || headSwap)
            {
                dead1 = true;
                dead2 = true;
            }

            if (dead1)
                _snake1Alive = false;

            if (dead2)
                _snake2Alive = false;
        }

        private bool IsWallCollision((int X, int Y) head)
            => head.X < 0 || head.X >= BoardWidth || head.Y < 0 || head.Y >= BoardHeight;

        private bool IsSelfCollision(LinkedList<(int X, int Y)> snake, (int X, int Y) head)
        {
            var current = snake.First!.Next;
            while (current != null)
            {
                if (current.Value.Equals(head))
                    return true;
                current = current.Next;
            }
            return false;
        }

        private bool IsEnemyCollision(LinkedList<(int X, int Y)> enemySnake, (int X, int Y) head)
        {
            var current = enemySnake.First;
            while (current != null)
            {
                if (current.Value.Equals(head))
                    return true;
                current = current.Next;
            }
            return false;
        }

        private void DetectFood()
        {
            var head1 = _snake1.First!.Value;
            var head2 = _snake2.First!.Value;

            bool ate1 = false;
            bool ate2 = false;

            if (_snake1Alive && head1.Equals(FoodPosition))
            {
                ate1 = true;
                ScoreP1++;
            }

            if (_snake2Alive && head2.Equals(FoodPosition))
            {
                ate2 = true;
                ScoreP2++;
            }

            if (ate1 || ate2)
            {
                MoveSnake(_snake1, Player1Direction, ate1);
                MoveSnake(_snake2, Player2Direction, ate2);
                SpawnFood();
            }
        }

        private void SpawnFood()
        {
            while (true)
            {
                int x = Random.Shared.Next(BoardWidth);
                int y = Random.Shared.Next(BoardHeight);
                int key = ToKey(x, y);

                if (!_occupied.Contains(key))
                {
                    FoodPosition = (x, y);
                    _occupied.Add(key);
                    return;
                }
            }
        }

        private void DetectWinner()
        {
            if (!_snake1Alive && !_snake2Alive)
            {
                WinnerPlayerId = "";
                return;
            }

            if (!_snake1Alive && _snake2Alive)
            {
                WinnerPlayerId = Player2Id;
                return;
            }

            if (_snake1Alive && !_snake2Alive)
            {
                WinnerPlayerId = Player1Id;
                return;
            }
        }

        public override void HandleAction(string playerId, JsonElement action)
        {
            lock (_lock)
            {
                if (Player1Id != playerId && Player2Id != playerId)
                    return;

                if (action.ValueKind != JsonValueKind.Object
                    || !action.TryGetProperty("type", out var typeProp)
                    || !typeProp.ValueEquals(ActionChangeDirection)
                    || !action.TryGetProperty("direction", out var directionProp))
                    return;

                var directionStr = directionProp.GetString();
                if (!Enum.TryParse<Direction>(directionStr, true, out var direction))
                    return;

                if (playerId == Player1Id)
                {
                    if (IsValidTurn(Player1Direction, direction))
                        _pendingDir1 = direction;
                }
                else
                {
                    if (IsValidTurn(Player2Direction, direction))
                        _pendingDir2 = direction;
                }
            }
        }

        private static bool IsValidTurn(Direction current, Direction next)
        {
            return (current, next) switch
            {
                (Direction.Up, Direction.Down) => false,
                (Direction.Down, Direction.Up) => false,
                (Direction.Left, Direction.Right) => false,
                (Direction.Right, Direction.Left) => false,
                _ => true
            };
        }

        public override void MakeBotMove()
        {
            lock (_lock)
            {
                if (!IsBotGame || IsFinished || !HasStarted || !_snake2Alive)
                    return;

                var head = _snake2.First!.Value;
                var bestDir = Player2Direction;

                var candidates = new Direction[] { Direction.Up, Direction.Down, Direction.Left, Direction.Right };
                var validCandidates = candidates.Where(d => IsValidTurn(Player2Direction, d)).ToArray();

                int bestScore = int.MinValue;

                foreach (var dir in validCandidates)
                {
                    var next = GetNextPosition(head, dir);
                    int score = EvaluateMove(next, _snake2, _snake1);

                    if (score > bestScore)
                    {
                        bestScore = score;
                        bestDir = dir;
                    }
                }

                _pendingDir2 = bestDir;
            }
        }

        private int EvaluateMove((int X, int Y) next, LinkedList<(int X, int Y)> mySnake, LinkedList<(int X, int Y)> enemySnake)
        {
            if (IsWallCollision(next))
                return int.MinValue;

            if (IsSelfCollision(mySnake, next))
                return int.MinValue;

            if (IsEnemyCollision(enemySnake, next))
                return int.MinValue;

            int score = 0;

            if (next.Equals(FoodPosition))
                score += 1000;

            int distToFood = Math.Abs(next.X - FoodPosition.X) + Math.Abs(next.Y - FoodPosition.Y);
            score -= distToFood;

            int distToWall = Math.Min(Math.Min(next.X, BoardWidth - 1 - next.X), Math.Min(next.Y, BoardHeight - 1 - next.Y));
            score += distToWall * 2;

            return score;
        }

        public override void ResetForNewRound()
        {
            lock (_lock)
            {
                base.ResetForNewRound();
                ScoreP1 = 0;
                ScoreP2 = 0;
                Player1Direction = Direction.Right;
                Player2Direction = Direction.Left;
                _pendingDir1 = null;
                _pendingDir2 = null;
                _snake1Alive = true;
                _snake2Alive = true;
                _gameEndedThisTick = false;

                _snake1.Clear();
                _snake2.Clear();
                _occupied.Clear();

                int startY1 = BoardHeight / 2;
                int startX1 = 2;
                for (int i = 0; i < InitialSnakeLength; i++)
                {
                    var segment = (startX1 - i, startY1);
                    _snake1.AddLast(segment);
                    _occupied.Add(ToKey(segment));
                }

                int startY2 = BoardHeight / 2;
                int startX2 = BoardWidth - 3;
                for (int i = 0; i < InitialSnakeLength; i++)
                {
                    var segment = (startX2 + i, startY2);
                    _snake2.AddLast(segment);
                    _occupied.Add(ToKey(segment));
                }

                SpawnFood();
            }
        }

        public override object GetStatePayload() => new
        {
            roomId = RoomId,
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
            foodPosition = FoodPosition,
            snake1Positions = _snake1.ToArray(),
            snake2Positions = _snake2.ToArray(),
            player1Direction = Player1Direction.ToString(),
            player2Direction = Player2Direction.ToString(),
            player1Score = ScoreP1,
            player2Score = ScoreP2,
            score = Score
        };

        private int ToKey((int X, int Y) pos) => ToKey(pos.X, pos.Y);
        private int ToKey(int x, int y) => y * BoardWidth + x;
    }

    public enum Direction
    {
        Up,
        Down,
        Left,
        Right
    }
}
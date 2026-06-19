const en = {
  page: {
    title: "Tic Tac Toe",
    subtitle: "Multiplayer Arena",
  },

  auth: {
    loading: "Loading player...",
    notLoggedIn: "Not logged in",
    loggedInAs: "Logged in as",
  },

  status: {
    ready: "Ready",
    disconnected: "Disconnected",
    searching: "Searching for opponent...",
    inGame: "Match Started",
    finished: "Game Finished",
    yourTurn: "Your Turn",
    opponentTurn: "Opponent Turn",
  },

  matchmaking: {
    joinQueue: "Join Matchmaking",
    searching: "Searching For Opponent",
    cancel: "Cancel Search",
  },

  room: {
    title: "Match Information",
    roomId: "Room",
    symbol: "Your Symbol",
  },

  player: {
    title: "Player Profile",
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    level: "Level",
    online: "Online",
    offline: "Offline",
  },

  opponent: {
    title: "Opponent",
    waiting: "Waiting for opponent...",
    connected: "Connected",
  },

  game: {
    board: "Game Board",
    playAgain: "Play Again",
    leaveMatch: "Leave Match",
  },

  result: {
    victory: "Victory",
    defeat: "Defeat",
    draw: "Draw",
  },

  notifications: {
    connected: "Connected to server",
    disconnected: "Connection lost",
    matchFound: "Opponent found",
    waitingOpponent: "Waiting for opponent",
  },
};

export type TEnTicTacToe = typeof en;
export default en;

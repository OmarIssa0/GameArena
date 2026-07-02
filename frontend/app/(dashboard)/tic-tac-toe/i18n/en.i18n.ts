const en = {
  lobby: {
    title: "Tic Tac Toe",
    subtitle: "Deploy strategic marks in a classic 3x3 duel",
    findMatch: "Find Match",
    createGame: "Create Game",
    connecting: "Connecting to Game Server...",
    tabs: {
      quick: "Quick Match",
      invite: "Invite Friend",
    },
    inviteTitle: "Invite a Friend",
    searchFriends: "Search friends...",
    noFriendsFound: "No friends found",
    searchingTitle: "Searching for opponent...",
    searchingSubtitle: "Checking GameArena servers",
    cancelSearch: "Cancel Search",
    waitingForOpponent: "Waiting for opponent to accept invite or join...",
    cancelMatch: "Cancel Match",
    opponentFound: "OPPONENT FOUND!",
    startGame: "Start Game",
    waitingForStart: "Waiting for opponent to start...",
  },

  searching: {
    title: "Finding a match",
    subtitle: "Scanning for available players",
    cancel: "Cancel",
    stages: {
      server: "Connecting to server",
      scanning: "Scanning for players",
      joining: "Joining match room",
      starting: "Starting game",
    },
    stageBadge: {
      pending: "Pending",
      scanning: "Scanning…",
      connected: "Connected",
      joined: "Joined",
      ready: "Ready!",
    },
  },

  players: {
    you: "You",
    player1: "Player 1",
    player2: "Player 2",
    opponent: "Opponent",
    waitingForOpponent: "Waiting for opponent…",
    vs: "VS",
  },

  turn: {
    yourTurn: "Your turn — make your move",
    // use {{name}} as placeholder
    waiting: "Waiting for {{name}}…",
  },

  end: {
    win: {
      icon: "🏆",
      title: "Victory!",
      description: "Spectacular play — you defeated your opponent.",
    },
    lose: {
      icon: "😞",
      title: "Defeat",
      description: "Good effort, but your opponent claimed victory this time.",
    },
    draw: {
      icon: "🤝",
      title: "It's a draw",
      description: "A hard-fought battle — perfectly even.",
    },
    opponentDisconnected: {
      icon: "🏆",
      title: "Opponent forfeited!",
      description: "Your opponent left the game. You win by default.",
    },
    playAgain: "Play again",
    lobby: "Lobby",
  },

  game: {
    you: "You",
    opponent: "Opponent",
    waiting: "Waiting...",
    player1: "Player 1",
    player2: "Player 2",
    opponentForfeited: "Opponent Forfeited!",
    opponentForfeitedDesc: "Your opponent left the game. You win by default!",
    victory: "VICTORY! 🎉",
    victoryDesc: "Spectacular play! You defeated your opponent.",
    draw: "IT'S A DRAW! 🤝",
    drawDesc: "A hard-fought battle! It's a tie.",
    defeat: "DEFEAT! 😢",
    defeatDesc: "Good effort, but opponent claimed victory this time.",
    yourTurn: "Your Turn - Make your move!",
    waitingFor: "Waiting for {name}...",
  },
};

type TicTacToeTranslations = typeof en;

export { en, type TicTacToeTranslations };

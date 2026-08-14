const en = {
  welcome: (name: string) => "Welcome back" + (name ? `, ${name}` : ""),
  welcomeDesc: "let's find your next battle!",
  brand: "Arena 404",
  heroSubtitle: "Your ultimate gaming destination. Instant matches, ranked battles, and endless fun.",
  playNow: "PLAY NOW",
  stats: {
    gamesAvailable: "Games Available",
    unreadMessages: "Unread Messages",
    friendRequests: "Friend Requests"
  },
  features: {
    title: "Why Arena 404?",
    badge: "FEATURES",
    instantPlay: "Instant Play",
    instantPlayDesc: "Jump into matches in seconds",
    playWithFriends: "Play with Friends",
    playWithFriendsDesc: "Invite and challenge anyone",
    rankedMatches: "Ranked Matches",
    rankedMatchesDesc: "Climb the leaderboards",
    seasonalEvents: "Seasonal Events",
    seasonalEventsDesc: "Exclusive rewards & modes"
  },
  games: {
    snake: "Snake",
    snakeDesc: "Classic arcade — eat & survive",
    ticTacToe: "Tic Tac Toe",
    ticTacToeDesc: "3×3 tactical duel",
    pong: "Ping Pong",
    pongDesc: "Retro table tennis"
  },
  recentHistory: {
    title: "Recent Battles",
    viewAll: "View all",
    emptyTitle: "No battles yet",
    emptyDescription: "Play your first match and your history will show up here."
  },
  enterArena: "Enter the Arena",
  gamesAvailable: "Games Available"
}
;

type THomeTranslation = typeof en;
export { en, type THomeTranslation };

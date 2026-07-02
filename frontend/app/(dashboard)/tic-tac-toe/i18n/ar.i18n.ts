import { TicTacToeTranslations } from "./en.i18n";

const ar: TicTacToeTranslations = {
  lobby: {
    title: "إكس أو",
    subtitle: "ضع علاماتك الاستراتيجية في مباراة كلاسيكية 3×3",
    findMatch: "ابحث عن خصم",
    createGame: "إنشاء لعبة",
    connecting: "جارٍ الاتصال بخادم اللعبة...",
    tabs: {
      quick: "مباراة سريعة",
      invite: "دعوة صديق",
    },
    inviteTitle: "ادعُ صديقًا",
    searchFriends: "ابحث عن أصدقاء...",
    noFriendsFound: "لم يتم العثور على أصدقاء",
    searchingTitle: "جارٍ البحث عن خصم...",
    searchingSubtitle: "جارٍ فحص خوادم GameArena",
    cancelSearch: "إلغاء البحث",
    waitingForOpponent: "في انتظار قبول الخصم للدعوة أو الانضمام...",
    cancelMatch: "إلغاء المباراة",
    opponentFound: "تم العثور على خصم!",
    startGame: "بدء اللعبة",
    waitingForStart: "في انتظار بدء الخصم للعبة...",
  },

  searching: {
    title: "البحث عن خصم",
    subtitle: "جارٍ فحص اللاعبين المتاحين",
    cancel: "إلغاء",
    stages: {
      server: "الاتصال بالخادم",
      scanning: "البحث عن لاعبين",
      joining: "الانضمام إلى الغرفة",
      starting: "بدء اللعبة",
    },
    stageBadge: {
      pending: "انتظار",
      scanning: "جارٍ الفحص…",
      connected: "متصل",
      joined: "انضممت",
      ready: "جاهز!",
    },
  },

  players: {
    you: "أنت",
    player1: "اللاعب 1",
    player2: "اللاعب 2",
    opponent: "الخصم",
    waitingForOpponent: "في انتظار الخصم…",
    vs: "ضد",
  },

  turn: {
    yourTurn: "دورك — اختر خطوتك",
    waiting: "في انتظار {{name}}…",
  },

  end: {
    win: {
      icon: "🏆",
      title: "فزت!",
      description: "أداء رائع — لقد تفوقت على خصمك.",
    },
    lose: {
      icon: "😞",
      title: "خسرت",
      description: "جهد جيد، لكن خصمك حقق الفوز هذه المرة.",
    },
    draw: {
      icon: "🤝",
      title: "تعادل",
      description: "مباراة شرسة — متكافئة تمامًا.",
    },
    opponentDisconnected: {
      icon: "🏆",
      title: "الخصم انسحب!",
      description: "غادر خصمك اللعبة. فزت بشكل تلقائي.",
    },
    playAgain: "العب مجدداً",
    lobby: "القائمة الرئيسية",
  },

  game: {
    you: "أنت",
    opponent: "الخصم",
    waiting: "انتظار...",
    player1: "اللاعب 1",
    player2: "اللاعب 2",
    opponentForfeited: "الخصم انسحب!",
    opponentForfeitedDesc: "غادر خصمك اللعبة. تفوز افتراضيًا!",
    victory: "فوز! 🎉",
    victoryDesc: "أداء رائع! لقد تفوقت على خصمك.",
    draw: "تعادل! 🤝",
    drawDesc: "معركة شرسة! انتهت بالتعادل.",
    defeat: "خسارة! 😢",
    defeatDesc: "مجهود جيد، لكن الخصم حقق الفوز هذه المرة.",
    yourTurn: "دورك - قم بحركتك!",
    waitingFor: "في انتظار {name}...",
  },
};

export { ar };

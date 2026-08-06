export const ar = {
  badge: "الإشعارات",
  title: "الإشعارات",
  subtitle: "جميع إشعاراتك في مكان واحد",
  tabs: {
    all: "الكل",
    gameInvites: "دعوات الألعاب",
    friendRequests: "طلبات الصداقة",
    messages: "الرسائل",
  },
  empty: {
    title: "لا توجد إشعارات",
    description: "أنت على اطلاع بكل شيء!",
  },
  error: {
    title: "تعذر تحميل الطلبات",
  },
  gameInvite: {
    title: "دعوة لعبة",
    description: "{name} دعاك للعب {game}",
    fallbackName: "شخص ما",
  },
  friendRequest: {
    title: "طلب صداقة",
    description: "{name} يريد أن يكون صديقك",
    accept: "قبول",
    decline: "رفض",
  },
  message: {
    title: "رسالة جديدة",
    description: "{name}: {preview}",
  },
  actions: {
    view: "عرض",
    accept: "قبول",
    decline: "رفض",
    dismiss: "إخفاء",
  },
  time: {
    justNow: "الآن",
    minutesAgo: "منذ {n} دقيقة",
    hoursAgo: "منذ {n} ساعة",
    daysAgo: "منذ {n} يوم",
  },
  markAllRead: "تحديد الكل كمقروء",
};

export type TNotificationsTranslation = typeof ar;
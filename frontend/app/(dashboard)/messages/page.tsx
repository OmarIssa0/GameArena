"use client";
import { Search, Send, CheckCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/Hooks/useTranslation";
import ar from "./i18n/ar.i18n";
import en, { TMessagesTranslation } from "./i18n/en.i18n";

type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  seen: boolean;
};

type Conversation = {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "playing" | "offline";
  lastMsg: string;
  lastTime: string;
  unread: number;
  messages: Message[];
};

const conversations: Conversation[] = [
  {
    id: 1, name: "Ahmed", avatar: "https://i.pravatar.cc/150?img=1",
    status: "online", lastMsg: "See you in the arena!", lastTime: "2m",
    unread: 2,
    messages: [
      { id: 1, text: "Hey! Want to play?", sender: "other", time: "10:30", seen: true },
      { id: 2, text: "Sure, give me 5 min", sender: "me", time: "10:31", seen: true },
      { id: 3, text: "See you in the arena!", sender: "other", time: "10:32", seen: true },
    ],
  },
  {
    id: 2, name: "Sara", avatar: "https://i.pravatar.cc/150?img=5",
    status: "playing", lastMsg: "Good game!", lastTime: "15m",
    unread: 0,
    messages: [
      { id: 1, text: "Good game!", sender: "other", time: "9:15", seen: true },
    ],
  },
  {
    id: 3, name: "Omar", avatar: "https://i.pravatar.cc/150?img=11",
    status: "offline", lastMsg: "Let's rematch", lastTime: "1h",
    unread: 1,
    messages: [
      { id: 1, text: "Let's rematch", sender: "other", time: "8:00", seen: false },
    ],
  },
];

const statusColors = {
  online: "bg-neon-green",
  playing: "bg-neon-cyan",
  offline: "bg-text-muted",
};

export default function Messages() {
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [conversationsList, setConversationsList] = useState(conversations);
  const searchParams = useSearchParams();
  const t = useTranslation({ en, ar }) as TMessagesTranslation;

  useEffect(() => {
    const friend = searchParams.get("friend");
    if (friend) {
      const match = conversationsList.find((c) => c.name === friend);
      if (match) setActiveChat(match);
    }
  }, [searchParams, conversationsList]);

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const msg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seen: false,
    };
    const updated = conversationsList.map((c) =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, msg], lastMsg: msg.text, lastTime: "now", unread: 0 }
        : c
    );
    setConversationsList(updated);
    setActiveChat({ ...activeChat, messages: [...activeChat.messages, msg] });
    setInput("");
  };

  const statusText = (status: string) => {
    if (status === "online") return t.online;
    if (status === "playing") return t.playing;
    return t.offline;
  };

  return (
    <div className="flex h-full relative z-10">
      {/* Conversation List */}
      <div className="w-80 shrink-0 border-r border-border flex flex-col bg-bg-dark/50">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold text-white mb-3">{t.title}</h2>
          <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-text-muted" />
            <input
              className="bg-transparent text-sm text-text outline-none w-full placeholder:text-text-muted"
              placeholder={t.search}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversationsList.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 p-4 border-b border-border/50 text-left transition-colors hover:bg-surface-alt/50 cursor-pointer ${activeChat?.id === chat.id ? "bg-surface-alt" : ""
                }`}
            >
              <div className="relative shrink-0">
                <img src={chat.avatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColors[chat.status]} border-2 border-bg-dark`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-white truncate">{chat.name}</span>
                  <span className="text-[11px] text-text-muted shrink-0">{chat.lastTime}</span>
                </div>
                <p className="text-xs text-text-secondary truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-bg-dark/50">
              <img src={activeChat.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h3 className="text-sm font-semibold text-white">{activeChat.name}</h3>
                <span className="text-[11px] text-neon-green">{statusText(activeChat.status)}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-xl px-4 py-2 ${msg.sender === "me"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-surface border border-border text-text rounded-bl-md"
                    }`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                      <span className="text-[10px] text-white/60">{msg.time}</span>
                      {msg.sender === "me" && (
                        <CheckCheck className={`w-3 h-3 ${msg.seen ? "text-neon-cyan" : "text-white/40"}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-bg-dark/50">
              <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-2.5">
                <input
                  className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
                  placeholder={t.placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} className="text-primary hover:text-primary-hover transition-colors cursor-pointer">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
            {t.empty}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import messageClient, { type Message, type Conversation } from "@/services/messageClient";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/ToastContext";

interface ChatWindowProps {
  whisperId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserImage: string | null;
  onClose: () => void;
}

export default function ChatWindow({
  whisperId,
  otherUserId,
  otherUserName,
  otherUserImage,
  onClose,
}: ChatWindowProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_LENGTH = 20;

  useEffect(() => {
    setIsLoading(true);
    loadMessages();
    // Focus input on mount
    inputRef.current?.focus();

    // Auto-refresh messages every 3 seconds
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whisperId, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await messageClient.getMessages(whisperId, otherUserId);
      setMessages(data);
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      // Only show error toast on initial load
      if (messages.length === 0) {
        setIsLoading(false);
        showToast(
          error?.response?.data?.error || "Failed to load messages. Please try again.",
          "error"
        );
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || input.length > MAX_LENGTH || isSending) return;

    const content = input.trim();
    setInput("");
    setIsSending(true);

    try {
      const newMessage = await messageClient.sendMessage(
        whisperId,
        otherUserId,
        content
      );
      setMessages((prev) => [...prev, newMessage]);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      setInput(content); // Restore input on error
      showToast(
        error?.response?.data?.error || "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow input up to MAX_LENGTH characters
    if (value.length <= MAX_LENGTH) {
      setInput(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit on Enter key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isSending) {
        handleSend(e as any);
      }
    }
  };

  const isOwnMessage = (message: Message) => message.senderId === user?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass relative flex h-[80vh] w-full max-w-md flex-col rounded-3xl backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <img
              src={
                otherUserImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUserName)}&background=random`
              }
              alt={otherUserName}
              className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">{otherUserName}</p>
              <p className="text-xs text-slate-400">Emotion connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-4xl mb-2">💬</span>
              <p className="text-sm text-slate-400">
                Start a conversation with emojis and short messages
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage(message) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwnMessage(message)
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                      : "bg-white/10 text-white backdrop-blur-sm"
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="border-t border-white/10 p-4"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="💬 Emoji & short message (max 20)"
              maxLength={MAX_LENGTH}
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 transition"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Send"
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400 text-center">
            {input.length}/{MAX_LENGTH} characters
          </p>
        </form>
      </div>
    </div>
  );
}

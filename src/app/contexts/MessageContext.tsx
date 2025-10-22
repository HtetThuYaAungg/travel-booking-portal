"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageType = "success" | "error" | "info" | "warning" | "loading";

interface MessageInstance {
  id: string;
  type: MessageType;
  content: React.ReactNode;
  duration: number;
}

interface MessageContextType {
  success: (content: React.ReactNode, duration?: number) => string;
  error: (content: React.ReactNode, duration?: number) => string;
  info: (content: React.ReactNode, duration?: number) => string;
  warning: (content: React.ReactNode, duration?: number) => string;
  loading: (content: React.ReactNode, duration?: number) => string;
  remove: (id: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<MessageInstance[]>([]);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const addMessage = useCallback(
    (type: MessageType, content: React.ReactNode, duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);

      setMessages((prev) => [...prev, { id, type, content, duration }]);

      if (duration > 0 && type !== "loading") {
        setTimeout(() => {
          removeMessage(id);
        }, duration);
      }

      return id;
    },
    [removeMessage]
  );

  const contextValue: MessageContextType = {
    success: (content, duration) => addMessage("success", content, duration),
    error: (content, duration) => addMessage("error", content, duration),
    info: (content, duration) => addMessage("info", content, duration),
    warning: (content, duration) => addMessage("warning", content, duration),
    loading: (content, duration) => addMessage("loading", content, duration),
    remove: removeMessage,
  };

  const getIcon = (type: MessageType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "loading":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      {messages.length > 0 && (
        <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none">
          {messages.map((message) => (
            <div
              key={message.id}
              data-message-id={message.id}
              className={cn(
                "flex items-center gap-2 rounded-md bg-white px-4 py-2 shadow-md",
                "animate-in fade-in slide-in-from-top-5 duration-300",
                "dark:bg-gray-800"
              )}
            >
              {getIcon(message.type)}
              <span>{message.content}</span>
            </div>
          ))}
        </div>
      )}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
}

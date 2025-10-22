"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function SystemTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="font-mono text-xs">--:--:--</span>
          <span className="text-xs">--</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="font-mono text-xs">{formatTime(currentTime)}</span>
        <span className="text-xs">{formatDate(currentTime)}</span>
      </div>
    </div>
  );
} 
"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { MessageProvider } from "./contexts/MessageContext";

const Main = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MessageProvider>
          <AuthProvider>{children} </AuthProvider>
        </MessageProvider>
      </QueryClientProvider>
    </>
  );
};

export default Main;

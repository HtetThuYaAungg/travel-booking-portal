"use client";
import { AppSidebar } from "@/components/app-side-bar";
import DynamicBreadcrumb from "@/components/bread_crumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";
import { SystemTime } from "@/components/system-time";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebar();
  const [showSystemTime, setShowSystemTime] = useState(true);

  useEffect(() => {
    setShowSystemTime(false);
    const timer = setTimeout(() => {
      setShowSystemTime(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [open]);



  return (
    <>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="fixed w-full top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-1 px-2 z-10">
          <div className="flex relative justify-between w-full">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1 mr-2" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
            {showSystemTime && (
              <div
                className={`flex max-[768px]:hidden ${
                  open ? " mr-[200px]" : "mr-12"
                } items-center`}
              >
                <SystemTime />
              </div>
            )}
          </div>
        </header>

        <div className="flex w-full overflow-hidden px-4 gap-4">{children}</div>
      </SidebarInset>
    </>
  );
};

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "200px",
          } as React.CSSProperties
        }
      >
        <MainContent>{children}</MainContent>
      </SidebarProvider>
    </>
  );
};

export default Main;

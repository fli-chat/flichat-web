'use client';

import UserSidebar from "@/components/UserSidebar";
import { useSidebar } from "@/store/useSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <>
      <div className="relative h-dvh max-w-[750px] bg-semantic-primary mx-auto overflow-hidden">
        {children}

        {isOpen && (
          <UserSidebar />
        )}
      </div>

    </>
  );
}
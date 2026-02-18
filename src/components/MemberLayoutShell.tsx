"use client";

import { useState } from "react";
import MemberSidebar from "./MemberSidebar";
import MemberHeader from "./MemberHeader";

interface MemberLayoutShellProps {
  userName: string;
  children: React.ReactNode;
}

export default function MemberLayoutShell({
  userName,
  children,
}: MemberLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-navy-900">
      {/* Sidebar */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <MemberHeader
          userName={userName}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

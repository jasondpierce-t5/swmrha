"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutShellProps {
  userEmail: string;
  children: React.ReactNode;
}

export default function AdminLayoutShell({
  userEmail,
  children,
}: AdminLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-navy-900">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader
          userEmail={userEmail}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

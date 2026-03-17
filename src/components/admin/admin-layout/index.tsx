"use client";
import React, { useState } from "react";
import AdminSidebar from "../sidebar";
import AdminTopbar from "../topbar";

type Props = {
  children: React.ReactNode;
};

const AdminDashboardLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f9fafb", fontFamily: "'Lato', sans-serif" }}
    >
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar setSidebarOpen={setSidebarOpen} />
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

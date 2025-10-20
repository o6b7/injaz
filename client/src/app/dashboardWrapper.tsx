"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import StoreProvider, { useAppSelector } from "./redux";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main 
        className={`flex flex-col bg-gray-50 dark:bg-dark-bg transition-all duration-300 ${
          isSidebarCollapsed ? "w-full" : "w-[calc(100%-16rem)]"
        }`}
        style={{ marginRight: isSidebarCollapsed ? "0" : "16rem" }}
      >
        <Navbar />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
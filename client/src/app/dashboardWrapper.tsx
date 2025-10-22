"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import StoreProvider, { useAppDispatch, useAppSelector } from "./redux";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";
import { setIsSidebarCollapsed } from "@/state";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
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

  const handleOverlayClick = () => {
    dispatch(setIsSidebarCollapsed(true));
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <Sidebar />
      
      {/* Overlay for mobile when sidebar is open */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Main content */}
      <main 
        className={`
          flex flex-col flex-1 bg-gray-50 dark:bg-dark-bg transition-all duration-300
          w-full lg:w-[calc(100%-16rem)]
          ${!isSidebarCollapsed ? 'lg:mr-64' : ''}
        `}
      >
        <Navbar />
        <div className="flex-1 p-4 md:p-6 overflow-auto w-full">
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
        <div className="-mt-5">
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
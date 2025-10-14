"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { motion, AnimatePresence } from "framer-motion";
import { setIsSidebarCollapsed } from "@/state";
// import { signOut } from "aws-amplify/auth";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useGetProjectsQuery } from "@/state/api";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize mounted state for animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  // const { data: currentUser } = useGetAuthUserQuery({});
  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //   } catch (error) {
  //     console.error("Error signing out: ", error);
  //   }
  // };
  // if (!currentUser) return null;
  // const currentUserDetails = currentUser?.userDetails;

  // Handle sidebar toggle
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // Animation variants for RTL sidebar
  const sidebarVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        damping: 20, 
        stiffness: 200 
      }
    },
    closed: { 
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 200
      }
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar with animation */}
      <motion.div
        className="fixed flex flex-col h-full justify-between shadow-xl
          w-64 h-full z-40 dark:bg-gray-900 bg-white overflow-y-auto"
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarCollapsed ? "closed" : "open"}
        style={{ 
          right: 0, // Position on the right for RTL
          top: 0,
          transformOrigin: "right center" // Changed from left to right
        }}
      >
        <div className="flex h-full w-full flex-col justify-start">
          {/* TOP LOGO SECTION */}
          <div className="z-50 flex min-h-[56px] w-full items-center justify-between bg-white px-6 pt-3 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              إنجاز
            </div>
            <button
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          </div>
          
          {/* TEAM SECTION */}
          <div className="flex items-center gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="relative h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Team Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate dark:text-gray-200">
                EDROH TEAM
              </h3>
              <div className="mt-1 flex items-center gap-1">
                <LockIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Private</p>
              </div>
            </div>
          </div>
          
          {/* NAVBAR LINKS */}
          <nav className="z-10 w-full py-2">
            <SidebarLink icon={Home} label="الرئيسية" href="/" />
            <SidebarLink icon={Briefcase} label="الجدول الزمني" href="/timeline" />
            <SidebarLink icon={Search} label="بحث" href="/search" />
            <SidebarLink icon={Settings} label="الإعدادات" href="/settings" />
            <SidebarLink icon={User} label="المستخدمون" href="/users" />
            <SidebarLink icon={Users} label="الفرق" href="/teams" />
          </nav>

          {/* PROJECTS SECTION */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setShowProjects((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={showProjects}
            >
              <span className="font-medium">المشاريع</span>
              {showProjects ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {/* PROJECTS LIST - Animated container */}
            <AnimatePresence>
              {showProjects && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {projects?.map((project) => (
                    <SidebarLink
                      key={project.id}
                      icon={Briefcase}
                      label={project.name}
                      href={`/projects/${project.id}`}
                    />
                  ))}
                  
                  {/* Placeholder projects for demo */}
                  <SidebarLink icon={Briefcase} label="مشروع تجريبي ١" href="/projects/1" />
                  <SidebarLink icon={Briefcase} label="مشروع تجريبي ٢" href="/projects/2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PRIORITIES SECTION */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setShowPriority((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={showPriority}
            >
              <span className="font-medium">الأولوية</span>
              {showPriority ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {/* PRIORITIES LIST - Animated container */}
            <AnimatePresence>
              {showPriority && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <SidebarLink
                    icon={AlertCircle}
                    label="عاجل"
                    href="/priority/urgent"
                  />
                  <SidebarLink
                    icon={ShieldAlert}
                    label="مرتفع"
                    href="/priority/high"
                  />
                  <SidebarLink
                    icon={AlertTriangle}
                    label="متوسط"
                    href="/priority/medium"
                  />
                  <SidebarLink 
                    icon={AlertOctagon} 
                    label="منخفض" 
                    href="/priority/low" 
                  />
                  <SidebarLink
                    icon={Layers3}
                    label="قائمة الانتظار"
                    href="/priority/backlog"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* USER PROFILE SECTION (Mobile only) */}
        <div className="sticky bottom-0 z-10 mt-auto flex w-full flex-col items-center gap-4 bg-white px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
          {/* Placeholder user info for demo */}
          <div className="flex w-full items-center">
            <div className="align-center flex h-9 w-9 justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <span className="mx-3 text-sm text-gray-800 dark:text-white truncate flex-1">
              مستخدم تجريبي
            </span>
            <button
              className="self-start rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
              // onClick={handleSignOut}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full block" aria-current={isActive ? "page" : undefined}>
      <motion.div
        whileHover={{ x: -4 }} // Changed to negative for RTL
        whileTap={{ scale: 0.98 }}
        className={`relative flex cursor-pointer items-center gap-3 transition-colors px-6 py-3
          ${isActive 
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
      >
        {isActive && (
          <motion.div 
            className="absolute right-0 top-0 h-full w-1 bg-blue-500" 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        <Icon className={`h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-500"}`} />
        <span className={`text-sm font-medium ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
          {label}
        </span>
      </motion.div>
    </Link>
  );
};

export default Sidebar;
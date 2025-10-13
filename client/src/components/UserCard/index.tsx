import { User } from '@/state/api'
import Image from 'next/image';
import React, { useState } from 'react'
import { Mail, Phone, MapPin, Calendar, Users, Award, Clock, Crown, Star, MoreVertical, Eye, MessageCircle, UserCheck, UserX, Shield } from 'lucide-react';

type Props = {
    user: User;
    showStats?: boolean;
    showActions?: boolean;
}

const UserCard = ({ user, showStats = true, showActions = true }: Props) => {
    const [showDetails, setShowDetails] = useState(false);
    
    // Mock user statistics (you can replace with actual API data)
    const userStats = {
        completedTasks: 24,
        inProgressTasks: 8,
        totalPoints: 1560,
        projectsInvolved: 6,
        performanceRating: 4.8,
        joinDate: "2024-01-15",
        lastActive: "2024-03-20"
    };

    const roleConfig: any = {
        "admin": {
            border: "border-r-4 border-r-purple-500",
            badge: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
            icon: <Crown size={14} />
        },
        "manager": {
            border: "border-r-4 border-r-blue-500",
            badge: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
            icon: <Shield size={14} />
        },
        "lead": {
            border: "border-r-4 border-r-emerald-500",
            badge: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
            icon: <Star size={14} />
        },
        "member": {
            border: "border-r-4 border-r-purple-500",
            badge: "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
            icon: <Users size={14} />
        }
    };

    const statusConfig: any = {
        "active": {
            dot: "bg-emerald-400",
            text: "نشط"
        },
        "away": {
            dot: "bg-amber-400",
            text: "بعيد"
        },
        "busy": {
            dot: "bg-red-400",
            text: "مشغول"
        },
        "offline": {
            dot: "bg-gray-400",
            text: "غير متصل"
        }
    };

    // Determine user role and status (you can replace with actual user data)
    const userRole = user.teamId ? "member" : "admin"; // Example logic
    const userStatus = "active"; // Example status
    const config = roleConfig[userRole];
    const status = statusConfig[userStatus];

    return (
        <div className={`group bg-white rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-dark-secondary dark:text-white border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 ${config.border}`}>
            
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                            {user.profilePictureUrl ? (
                                <Image 
                                    src="/p4.jpeg"
                                    alt={user.username}
                                    width={64}
                                    height={64}
                                    className="rounded-2xl object-cover"
                                />
                            ) : (
                                <span className="text-white font-bold text-lg">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        
                        {/* Online Status Dot */}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${status.dot}`} 
                             title={status.text} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                @{user.username}
                            </span>
                            
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${config.badge}`}>
                                {config.icon}
                                {userRole === "admin" && "مدير"}
                                {/* {userRole === "manager" && "مسؤول"}
                                {userRole === "lead" && "قائد"} */}
                                {userRole === "member" && "عضو"}
                            </span>

                            {/* Performance Rating */}
                            {userStats.performanceRating && (
                                <span className="text-xs font-medium px-2 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
                                    <Star size={12} className="fill-amber-400" />
                                    {userStats.performanceRating}
                                </span>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-1 truncate">
                            {user.username}
                        </h3>
                        
                        {user.email && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm truncate flex items-center gap-1">
                                <Mail size={14} />
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                    <MoreVertical size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Stats Section */}
            {showStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {userStats.completedTasks}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">مكتملة</div>
                    </div>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {userStats.inProgressTasks}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">قيد العمل</div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {userStats.totalPoints}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">نقطة</div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {userStats.projectsInvolved}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">مشاريع</div>
                    </div>
                </div>
            )}

            {/* Detailed Info - Collapsible */}
            {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in duration-300">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">معلومات التواصل</h4>
                    
                    <div className="space-y-2 text-sm">
                        {user.email && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail size={16} className="text-gray-400" />
                                <span>{user.email}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar size={16} className="text-gray-400" />
                            <span>انضم في {format(new Date(userStats.joinDate), "MMM dd, yyyy")}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock size={16} className="text-gray-400" />
                            <span>آخر نشاط: {format(new Date(userStats.lastActive), "MMM dd, yyyy")}</span>
                        </div>
                        
                        {user.teamId && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Users size={16} className="text-gray-400" />
                                <span>الفريق: #{user.teamId}</span>
                            </div>
                        )}
                    </div>

                    {/* Skills/Tags */}
                    <div className="mt-3">
                        <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">المهارات</h5>
                        <div className="flex flex-wrap gap-2">
                            {["React", "TypeScript", "UI/UX", "التخطيط"].map((skill, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {showActions && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                        <span>{status.text}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200 hover:scale-110">
                            <MessageCircle size={18} />
                        </button>
                        
                        <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all duration-200 hover:scale-110">
                            <UserCheck size={18} />
                        </button>
                        
                        {userRole !== "admin" && (
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-200 hover:scale-110">
                                <MoreVertical size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// Helper function for date formatting
function format(date: Date, format: string): string {
    return new Intl.DateTimeFormat('ar-EG', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(date);
}

export default UserCard
import { Project, useGetTasksQuery } from '@/state/api'
import { format } from "date-fns";
import Image from 'next/image';
import React, { useState } from 'react'
import { Calendar, Users, FolderOpen, ChevronRight, Clock, Target, MoreVertical, Eye, EyeOff } from 'lucide-react';

type Props = {
    project: Project;
    showStats?: boolean;
}

const ProjectCard = ({ project, showStats = true }: Props) => {
    const [showDetails, setShowDetails] = useState(false);
    const { data: tasks = [], isLoading } = useGetTasksQuery({ projectId: project.id });
    
    // Calculate project statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "مكتملة").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate days remaining
    const daysRemaining = project.endDate 
        ? Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const statusColors: any = {
        "active": {
            border: "border-r-4 border-r-emerald-500",
            badge: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
        },
        "onHold": {
            border: "border-r-4 border-r-amber-500",
            badge: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
        },
        "completed": {
            border: "border-r-4 border-r-gray-500",
            badge: "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        },
        "planning": {
            border: "border-r-4 border-r-blue-500",
            badge: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
        }
    };

    // Determine project status based on dates and completion
    const getProjectStatus = () => {
        if (completionRate === 100) return "completed";
        if (daysRemaining !== null && daysRemaining < 0) return "onHold";
        if (daysRemaining !== null && daysRemaining < 7) return "active";
        return "planning";
    };

    const projectStatus = getProjectStatus();
    const config = statusColors[projectStatus];

    const statusLabels: any = {
        "active": "نشط",
        "onHold": "متوقف",
        "completed": "مكتمل",
        "planning": "قيد التخطيط"
    };

    return (
        <div className={`group bg-white rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-dark-secondary dark:text-white border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 ${config.border}`}>
            
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                        <FolderOpen size={24} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                #{project.id}
                            </span>
                            
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${config.badge}`}>
                                {statusLabels[projectStatus]}
                            </span>

                            {daysRemaining !== null && (
                                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                                    daysRemaining < 0 
                                        ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                                        : daysRemaining < 7
                                        ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                                        : "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                                }`}>
                                    {daysRemaining < 0 ? `متأخر ${Math.abs(daysRemaining)} يوم` : `${daysRemaining} يوم متبقي`}
                                </span>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl truncate">
                            {project.name}
                        </h3>
                    </div>
                </div>

                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                    <MoreVertical size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Description */}
            {project.description && (
                <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                        {project.description}
                    </p>
                </div>
            )}

            {/* Progress Bar */}
            {showStats && totalTasks > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>التقدم</span>
                        <span className="font-semibold">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionRate}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Stats Section */}
            {showStats && (
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
                    {/* Total Tasks */}
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                        <FolderOpen size={16} className="text-gray-400" />
                        <span className="font-medium">{totalTasks} مهام</span>
                    </div>

                    {/* Completed Tasks */}
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                        <Target size={16} className="text-emerald-500" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {completedTasks} مكتملة
                        </span>
                    </div>

                    {/* Timeline */}
                    {(project.startDate || project.endDate) && (
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="font-medium">
                                {project.startDate && format(new Date(project.startDate), "MMM dd")}
                                {project.endDate && ` - ${format(new Date(project.endDate), "MMM dd")}`}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Detailed Stats - Collapsible */}
            {showDetails && showStats && totalTasks > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in duration-300">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">تفاصيل المهام</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {tasks.filter(t => t.status === "قيد التخطيط").length}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">قيد التخطيط</div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {tasks.filter(t => t.status === "قيد التنفيذ").length}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">قيد التنفيذ</div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {tasks.filter(t => t.status === "قيد المراجعة").length}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">قيد المراجعة</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                {completedTasks}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">مكتملة</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={16} />
                    <span>آخر تحديث: {format(new Date(), "MMM dd, yyyy")}</span>
                </div>
                
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors group">
                    <span>عرض المشروع</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    )
}

export default ProjectCard
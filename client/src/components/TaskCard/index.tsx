import { Task, useUpdateTaskStatusMutation } from '@/state/api'
import { format } from "date-fns";
import Image from 'next/image';
import React, { useState } from 'react'
import { MessageSquareMore, Calendar, User, ImageIcon, X, Clock, Award, ChevronDown, Eye, EyeOff } from 'lucide-react';

type Props = {
    task: Task;
    showStatusToggle?: boolean;
}

const TaskCard = ({ task, showStatusToggle = false }: Props) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    
    const hasImage = task.attachments && task.attachments.length > 0;
    const firstAttachment = hasImage ? task.attachments?.[0] : null;
    const numberOfComments = (task.comments && task.comments.length) || 0;

    const statusConfig: any = {
        "قيد التخطيط": {
            border: "border-r-4 border-r-blue-500",
            badge: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
        },
        "قيد التنفيذ": {
            border: "border-r-4 border-r-emerald-500",
            badge: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
        },
        "قيد المراجعة": {
            border: "border-r-4 border-r-amber-500",
            badge: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
        },
        "مكتملة": {
            border: "border-r-4 border-r-gray-500",
            badge: "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        }
    };

    const priorityColors: any = {
        "عاجلة": "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
        "مرتفعة": "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
        "متوسطة": "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
        "منخفضة": "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
        "قائمة الانتظار": "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    };

    const taskStatus = ["قيد التخطيط", "قيد التنفيذ", "قيد المراجعة", "مكتملة"];
    
    const currentStatus = task.status && statusConfig[task.status] ? task.status : "مكتملة";
    const config = statusConfig[currentStatus];

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateTaskStatus({ taskId: task.id, status: newStatus });
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    return (
        <>
            <div className={`group bg-white rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-dark-secondary dark:text-white border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 ${config.border}`}>
                {/* Image Preview */}
                {hasImage && firstAttachment && (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowImage(!showImage)}
                            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 mb-3"
                        >
                            {showImage ? (
                                <>
                                    <EyeOff size={16} />
                                    إخفاء الصورة
                                </>
                            ) : (
                                <>
                                    <Eye size={16} />
                                    عرض الصورة
                                </>
                            )}
                        </button>
                        
                        {showImage && (
                            <div className="overflow-hidden rounded-lg cursor-pointer" onClick={() => setShowImageModal(true)}>
                                <Image 
                                    src={`/${firstAttachment.fileURL}`}
                                    alt={firstAttachment.fileName || 'Task attachment'}
                                    width={400}
                                    height={200}
                                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-start justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                #{task.id}
                            </span>
                            
                            {task.priority && (
                                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                </span>
                            )}
                            
                            <div className="flex items-center gap-2">
                                {showStatusToggle ? (
                                    <select
                                        value={task.status || ''}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.badge}`}
                                    >
                                        {taskStatus.map(status => (
                                            <option key={status} value={status} className="bg-white dark:bg-gray-800">
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    task.status && (
                                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${config.badge}`}>
                                            {task.status}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2 leading-tight">
                                {task.title}
                            </h3>
                            
                            {task.description && (
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                                    {task.description}
                                </p>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            {/* Dates */}
                            {(task.startDate || task.dueDate) && (
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="font-medium">
                                        {task.startDate && format(new Date(task.startDate), "MMM dd")}
                                        {task.dueDate && ` - ${format(new Date(task.dueDate), "MMM dd")}`}
                                    </span>
                                </div>
                            )}

                            {/* Assignee */}
                            {task.assignee && (
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                                    <User size={16} className="text-gray-400" />
                                    <span className="font-medium">{task.assignee.username}</span>
                                </div>
                            )}

                            {/* Comments */}
                            {numberOfComments > 0 && (
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                                    <MessageSquareMore size={16} className="text-gray-400" />
                                    <span className="font-medium">{numberOfComments}</span>
                                </div>
                            )}

                            {/* Points */}
                            {typeof task.points === "number" && (
                                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
                                    <Award size={16} className="text-purple-500" />
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        {task.points} pts
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Button - Only show if image is not already visible */}
                    {hasImage && firstAttachment && !showImage && (
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => setShowImageModal(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                            >
                                <ImageIcon size={18} className="transition-transform group-hover:scale-110" />
                                <span className="font-semibold">عرض الصورة</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && hasImage && firstAttachment && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md transition-all duration-300"
                    style={{top: "-12px"}}
                    onClick={() => setShowImageModal(false)}
                >
                    <div 
                        className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate">
                                    {firstAttachment.fileName || 'مرفق المهمة'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                    {task.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-110 ml-4"
                            >
                                <X size={24} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 flex items-center justify-center min-h-[400px] max-h-[70vh] overflow-auto">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image 
                                    src={`/${firstAttachment.fileURL}`}
                                    alt={firstAttachment.fileName || 'Task attachment'}
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="text-center sm:text-left">الحجم: {firstAttachment.fileName}</span>
                                <span className="text-center sm:text-right">انقر خارج الصورة للإغلاق</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default TaskCard
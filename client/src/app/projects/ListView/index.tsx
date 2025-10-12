import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react'

type ListProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({ id, setIsModalNewTaskOpen }: ListProps) => {
    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

    if (isLoading) return <div className="flex justify-center py-8">جاري التحميل...</div>
    if (error) return <div className="flex justify-center py-8 text-red-500">حدث خطأ اثناء جلب المهام</div>

    // Sort tasks: completed tasks at the bottom
    const sortedTasks = tasks?.slice().sort((a: Task, b: Task) => {
        const statusOrder: any = {
            "مكتملة": 4,
            "قيد المراجعة": 3,
            "قيد التنفيذ": 2,
            "قيد التخطيط": 1
        };

        const orderA = statusOrder[a.status || "قيد التخطيط"] || 5;
        const orderB = statusOrder[b.status || "قيد التخطيط"] || 5;

        return orderA - orderB;
    });

    return (
        <div className="px-4 pb-8 xl:px-6">
            <div className="pt-5">
                <Header name="قائمة" buttonComponent={
                    <button 
                        className='flex items-center bg-blue-primary rounded-md px-3 py-2 text-white hover:bg-blue-600'
                        onClick={() => setIsModalNewTaskOpen(true)}    
                    >
                        أضف مهمة
                    </button>
                } 
                isSmallText/>
            </div>
            <div className="space-y-3">
                {sortedTasks?.map((task: Task) => (
                    <TaskCard key={task.id} task={task} showStatusToggle />
                ))}
            </div>
        </div>
    )
}

export default ListView
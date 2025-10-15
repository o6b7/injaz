'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/app/redux';
import { useGetTasksByUserQuery, useGetProjectsQuery, Task, Priority } from '@/state/api';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import DataTable, { TableColumn, Direction } from 'react-data-table-component';
import { getCustomTableStyles, statusColors } from '@/app/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReusablePriorityPageProps {
  priority: Priority;
}

const ReusablePriorityPage: React.FC<ReusablePriorityPageProps> = ({ priority }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const userId = 1; 
  const [view, setView] = useState<'list' | 'table'>('list');

  // Fetch projects & user-specific tasks
  const { data: projects, isLoading: loadingProjects } = useGetProjectsQuery();
  const { data: allTasks, error, isLoading } = useGetTasksByUserQuery(userId);

  console.log(allTasks);
  

  // Filter tasks by priority
  const tasks = allTasks?.filter((t) => t.priority === priority) || [];

  // Group tasks by project
  const groupedTasks = projects
    ?.map((project) => ({
      ...project,
      tasks: tasks.filter((task) => task.projectId === project.id),
    }))
    .filter((group) => group.tasks.length > 0);

  if (isLoading || loadingProjects)
    return <div className="flex justify-center py-10 text-gray-500 dark:text-gray-300">جاري التحميل...</div>;
  if (error)
    return <div className="flex justify-center py-10 text-red-500 dark:text-red-400">حدث خطأ أثناء جلب المهام</div>;

  const columns: TableColumn<Task>[] = [
    {
      name: 'العنوان',
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-sm truncate dark:text-gray-100" title={row.title}>
          {row.title}
        </div>
      ),
    },
    {
      name: 'المشروع',
      selector: (row) => row.projectId.toString(),
      cell: (row) => {
        const project = projects?.find((p) => p.id === row.projectId);
        return <div className="text-sm dark:text-gray-200">{project?.name || '-'}</div>;
      },
    },
    {
      name: 'الوصف',
      selector: (row) => row.description || '',
      cell: (row) => (
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate" title={row.description}>
          {row.description || '-'}
        </div>
      ),
    },
    {
      name: 'الحالة',
      selector: (row) => row.status || '',
      cell: (row) => {
        const style = statusColors[row.status || 'قيد التخطيط'];
        return (
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {row.status || 'قيد التخطيط'}
          </span>
        );
      },
    },
    {
      name: 'تاريخ الانتهاء',
      selector: (row) => row.dueDate || '',
      cell: (row) => (
        <div className="text-xs dark:text-gray-300">
          {row.dueDate ? format(new Date(row.dueDate), 'd MMM yyyy', { locale: ar }) : '-'}
        </div>
      ),
    },
  ];

  return (
    <div className="h-full w-full p-4 pb-8 xl:px-6">
      <div className="pt-1">
        <div className="flex justify-between items-center mb-4">
          <Header name={`المهام ذات الأولوية: ${priority}`} isSmallText />
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                view === 'list' ? 'bg-blue-primary text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setView('list')}
            >
              عرض القائمة
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                view === 'table' ? 'bg-blue-primary text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setView('table')}
            >
              عرض الجدول
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="space-y-6">
            {groupedTasks?.map((group) => (
              <div key={group.id}>
                <h2 className="font-semibold text-lg mb-2 dark:text-gray-100">{group.name}</h2>
                <div className="space-y-3">
                  {group.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} showStatusToggle />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={tasks}
              direction={Direction.RTL}
              pagination
              paginationPerPage={10}
              highlightOnHover
              striped
              responsive
              selectableRows
              noDataComponent={
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">لا توجد مهام لعرضها</div>
              }
              customStyles={getCustomTableStyles(isDarkMode)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusablePriorityPage;

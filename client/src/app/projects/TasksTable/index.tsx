'use client';

import { useAppSelector } from '@/app/redux';
import { useGetTasksQuery, useUpdateTaskStatusMutation, Task } from '@/state/api';
import DataTable, { TableColumn, Direction } from 'react-data-table-component';
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getCustomTableStyles, statusColors, priorityColors } from '@/app/lib/utils';

type TasksTableProps = {
  projectId: number;
  showBulkActions?: boolean;
  showAddButton?: boolean;
  onAddTask?: () => void;
  title?: string;
  compact?: boolean;
};

const taskStatusOptions = ["قيد التخطيط", "قيد التنفيذ", "قيد المراجعة", "مكتملة"];

const TasksTable = ({ 
  projectId, 
  showBulkActions = false, 
  showAddButton = false,
  onAddTask,
  title = "المهام",
  compact = false
}: TasksTableProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [key, setKey] = useState(0);
  
  const { data: tasks, error, isLoading, refetch } = useGetTasksQuery({ projectId });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Handle row selection
  const handleRowSelected = useMemo(() => ({
    selectedRows,
  }: {
    selectedRows: Task[];
  }) => {
    setSelectedTasks(selectedRows);
  }, []);

  // Handle bulk status change
  const handleBulkStatusChange = async () => {
    if (!selectedStatus || selectedTasks.length === 0) return;

    try {
      const updatePromises = selectedTasks.map(task =>
        updateTaskStatus({ taskId: task.id, status: selectedStatus }).unwrap()
      );
      
      await Promise.all(updatePromises);
      setKey(prev => prev + 1);
      setSelectedTasks([]);
      setSelectedStatus("");
      refetch();
    } catch (error) {
      console.error('Failed to update task statuses:', error);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setKey(prev => prev + 1);
    setSelectedTasks([]);
    setSelectedStatus("");
  };

  // Handle individual task status change
  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await updateTaskStatus({ taskId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // Priority cell component with proper styling
  const PriorityCell = ({ priority }: { priority?: string }) => {
    const defaultPriority = "متوسطة";
    const actualPriority = priority || defaultPriority;
    
    // Use the corrected priority colors
    const style = priorityColors[actualPriority] || priorityColors[defaultPriority];
    
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
        {actualPriority}
      </span>
    );
  };

  // Status cell component
  const StatusCell = ({ row }: { row: Task }) => {
    const status = row.status || "قيد التخطيط";
    const style = statusColors[status] || statusColors["قيد التخطيط"];
    
    if (showBulkActions) {
      return (
        <select
          value={status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`rounded-full px-2 py-1 text-xs font-semibold border-0 focus:ring-2 focus:ring-opacity-50 ${style.bg} ${style.text} cursor-pointer`}
          style={{ 
            appearance: 'none',
            paddingRight: '8px',
            paddingLeft: '8px',
          }}
        >
          {taskStatusOptions.map((statusOption) => {
            const optionStyle = statusColors[statusOption] || statusColors['قيد التخطيط'];
            return (
              <option 
                key={statusOption} 
                value={statusOption}
                className={`${optionStyle.bg} ${optionStyle.text}`}
              >
                {statusOption}
              </option>
            );
          })}
        </select>
      );
    }

    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
        {status}
      </span>
    );
  };

  // Define columns that are common to both views
  const baseColumns: TableColumn<Task>[] = [
    {
      name: "العنوان",
      selector: (row) => row.title,
      sortable: true,
      width: "200px",
      cell: (row) => <div className="font-medium text-sm truncate dark:text-gray-100" title={row.title}>{row.title}</div>,
    },
    {
      name: "الوصف",
      selector: (row) => row.description || "",
      width: "250px",
      cell: (row) => (
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate" title={row.description}>
          {row.description || "-"}
        </div>
      ),
    },
    {
      name: "الحالة",
      selector: (row) => row.status || "",
      width: "150px",
      cell: (row) => <StatusCell row={row} />,
    },
    {
      name: "الأهمية",
      selector: (row) => row.priority || "",
      width: "130px",
      cell: (row) => <PriorityCell priority={row.priority} />,
    },
    {
      name: "تاريخ التسليم",
      selector: (row) => row.dueDate || "",
      width: "120px",
      cell: (row) => (
        <div className="text-xs dark:text-gray-300">{row.dueDate ? format(new Date(row.dueDate), "d MMM yyyy", { locale: ar }) : "-"}</div>
      ),
    },
  ];

  // Additional columns for full view
  const additionalColumns: TableColumn<Task>[] = [
    {
      name: "العلامات",
      selector: (row) => row.tags || "",
      width: "130px",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags ? row.tags.split(',').map((tag, i) => (
            <span key={i} className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
              {tag.trim()}
            </span>
          )) : <span className="text-gray-400 text-xs">-</span>}
        </div>
      ),
    },
    {
      name: "تاريخ البدء",
      selector: (row) => row.startDate || "",
      width: "120px",
      cell: (row) => (
        <div className="text-xs dark:text-gray-300">{row.startDate ? format(new Date(row.startDate), "d MMM yyyy", { locale: ar }) : "-"}</div>
      ),
    },
    {
      name: "المُنشئ",
      selector: (row) => row.author?.username || "غير معروف",
      width: "110px",
      cell: (row) => <div className="text-xs font-medium dark:text-gray-300">{row.author?.username || "غير معروف"}</div>,
    },
    {
      name: "المُعيّن",
      selector: (row) => row.assignee?.username || "لم يُعيّن",
      width: "110px",
      cell: (row) => <div className="text-xs font-medium dark:text-gray-300">{row.assignee?.username || "لم يُعيّن"}</div>,
    },
  ];

  const columns = compact ? baseColumns : [...baseColumns, ...additionalColumns];

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg dark:text-gray-300">جاري التحميل...</div></div>;
  if (error || !tasks) return <div className="flex items-center justify-center h-64"><div className="text-lg text-red-600 dark:text-red-400">حدث خطأ أثناء جلب المهام</div></div>;

  const sortedTasks = tasks.slice().sort((a, b) => {
    const order: Record<string, number> = { "قيد التخطيط": 1, "قيد التنفيذ": 2, "قيد المراجعة": 3, "مكتملة": 4 };
    return (order[a.status || "قيد التخطيط"] || 5) - (order[b.status || "قيد التخطيط"] || 5);
  });

  return (
    <div className="w-full" key={key}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
        
        {showAddButton && onAddTask && (
          <button 
            className='flex items-center bg-blue-primary rounded-md px-3 py-2 text-white hover:bg-blue-600 text-sm'
            onClick={onAddTask}
          >
            أضف مهمة
          </button>
        )}
      </div>

      {showBulkActions && selectedTasks.length > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedTasks.length} مهام محددة
          </span>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-dark-secondary dark:text-white"
          >
            <option value="">اختر الحالة</option>
            {taskStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={handleBulkStatusChange}
            disabled={!selectedStatus}
            className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            تغيير الحالة للمحدد
          </button>

          <button
            onClick={handleClearSelection}
            className="rounded-lg bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
          >
            إلغاء التحديد
          </button>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={sortedTasks}
          direction={Direction.RTL}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          highlightOnHover
          striped
          responsive
          selectableRows={showBulkActions}
          onSelectedRowsChange={showBulkActions ? handleRowSelected : undefined}
          noDataComponent={<div className="py-8 text-center text-gray-500 dark:text-gray-400">لا توجد مهام لعرضها</div>}
          customStyles={getCustomTableStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default TasksTable;
import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetTasksQuery, Task } from '@/state/api';
import DataTable, { TableColumn, Direction } from 'react-data-table-component';
import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getCustomTableStyles, statusColors, priorityColors } from '@/app/lib/utils';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

  const columns: TableColumn<Task>[] = [
    {
      name: "العنوان",
      selector: (row) => row.title,
      sortable: true,
      width: "120px",
      cell: (row) => <div className="font-medium text-sm truncate dark:text-gray-100" title={row.title}>{row.title}</div>,
    },
    {
      name: "الوصف",
      selector: (row) => row.description || "",
      width: "180px",
      cell: (row) => (
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate" title={row.description}>
          {row.description || "-"}
        </div>
      ),
    },
    {
      name: "الحالة",
      selector: (row) => row.status || "",
      width: "120px",
      cell: (row) => {
        const status = row.status || "قيد التخطيط";
        const style = statusColors[status] || statusColors["قيد التخطيط"]; 
        return (
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {status}
          </span>
        );
      },
    },
    {
      name: "الأهمية",
      selector: (row) => row.priority || "",
      width: "90px",
      cell: (row) => (
        <span className={`font-medium ${priorityColors[row.priority || "متوسطة"] || "text-gray-600 dark:text-gray-400"}`}>
          {row.priority || "-"}
        </span>
      ),
    },
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
      name: "تاريخ الانتهاء",
      selector: (row) => row.dueDate || "",
      width: "120px",
      cell: (row) => (
        <div className="text-xs dark:text-gray-300">{row.dueDate ? format(new Date(row.dueDate), "d MMM yyyy", { locale: ar }) : "-"}</div>
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

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg dark:text-gray-300">جاري التحميل...</div></div>;
  if (error || !tasks) return <div className="flex items-center justify-center h-64"><div className="text-lg text-red-600 dark:text-red-400">حدث خطأ أثناء جلب المهام</div></div>;

  const sortedTasks = tasks.slice().sort((a, b) => {
    const order: Record<string, number> = { "قيد التخطيط": 1, "قيد التنفيذ": 2, "قيد المراجعة": 3, "مكتملة": 4 };
    return (order[a.status || "قيد التخطيط"] || 5) - (order[b.status || "قيد التخطيط"] || 5);
  });

  return (
    <div className="h-full w-full p-4 pb-8 xl:px-6">
      <div className="pt-1">
        <div className="flex justify-between items-center mb-4">
          <Header name="جدول المهام" isSmallText buttonComponent={
            <button 
                className='flex items-center bg-blue-primary rounded-md px-3 py-2 text-white hover:bg-blue-600'
                onClick={() => setIsModalNewTaskOpen(true)}    
            >
                أضف مهمة
            </button>
          }/>
        </div>
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
            noDataComponent={<div className="py-8 text-center text-gray-500 dark:text-gray-400">لا توجد مهام لعرضها</div>}
            customStyles={getCustomTableStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default TableView;
'use client';

import React from 'react';
import Header from '@/components/Header';
import { useAppSelector } from '../redux';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  useGetProjectsQuery,
  useGetTasksQuery,
  Task,
  Project,
  Priority,
} from '@/state/api';
import DataTable, { TableColumn, Direction } from 'react-data-table-component';
import {
  getCustomTableStyles,
  statusColors,
  priorityColors,
} from '@/app/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const HomePage = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: tasks, isLoading: isTasksLoading, isError: isTasksError } = useGetTasksQuery({ projectId: 1 });
  const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError } = useGetProjectsQuery();

  if (isTasksLoading || isProjectsLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg dark:text-gray-300">جاري التحميل...</div>
      </div>
    );

  if (isTasksError || isProjectsError || !tasks || !projects)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600 dark:text-red-400">
          حدث خطأ أثناء جلب البيانات
        </div>
      </div>
    );

  // === Chart data ===
  const priorityCount = tasks.reduce((acc: Record<string, number>, task) => {
    const { priority } = task;
    acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
    return acc;
  }, {});

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

    const statusCount = projects.reduce((acc: Record<string, number>, project: Project) => {
        let status = 'نشط';
        if (project.endDate) {
            const end = new Date(project.endDate);
            const now = new Date();
            if (end <= now) status = 'مكتمل';
        }
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});


  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

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
      name: 'الأهمية',
      selector: (row) => row.priority || '',
      cell: (row) => (
        <span className={`font-medium ${priorityColors[row.priority || 'متوسطة'] || 'text-gray-600 dark:text-gray-400'}`}>
          {row.priority || '-'}
        </span>
      ),
    },
    {
      name: 'تاريخ التسليم',
      selector: (row) => row.dueDate || '',
      cell: (row) => (
        <div className="text-xs dark:text-gray-300">
          {row.dueDate ? format(new Date(row.dueDate), 'd MMM yyyy', { locale: ar }) : '-'}
        </div>
      ),
    },
  ];

  return (
    <div className="container h-full w-full bg-transparent p-8">
      <Header name="لوحة معلومات إدارة المشاريع" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* --- Chart 1 --- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">توزيع المهام حسب الأهمية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#303030' : '#E0E0E0'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#fff' : '#000'} />
              <YAxis stroke={isDarkMode ? '#fff' : '#000'} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={isDarkMode ? '#4A90E2' : '#82CA9D'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- Chart 2 --- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">حالة المهام</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={projectStatus} dataKey="count" nameKey="name" label>
                {projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* --- Table Section --- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">مهامك</h3>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={tasks}
              direction={Direction.RTL}
              pagination
              paginationPerPage={8}
              highlightOnHover
              striped
              responsive
              selectableRows
              noDataComponent={
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  لا توجد مهام لعرضها
                </div>
              }
              customStyles={getCustomTableStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

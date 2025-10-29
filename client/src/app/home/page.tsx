'use client';

import React, { useState } from 'react';
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
  Project,
  Priority,
  Status,
} from '@/state/api';
import TasksTable from '../projects/TasksTable';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const HomePage = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  
  const { data: tasks } = useGetTasksQuery({ projectId: selectedProjectId });
  const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError } = useGetProjectsQuery();

  if (isProjectsLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg dark:text-gray-300">جاري التحميل...</div>
      </div>
    );

  if (isProjectsError || !projects)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600 dark:text-red-400">
          حدث خطأ أثناء جلب المشاريع
        </div>
      </div>
    );

  // Handle project selection change
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(Number(event.target.value));
  };

  // Get selected project name for display
  const selectedProject = projects.find(project => project.id === selectedProjectId);
  const selectedProjectName = selectedProject ? selectedProject.name : 'المشاريع';

  // === Chart data ===
  // Priority distribution for bar chart
  const priorityCount = tasks?.reduce((acc: Record<string, number>, task) => {
    const { priority } = task;
    acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
    return acc;
  }, {}) || {};

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  // Task status distribution for pie chart
  const taskStatusCount = tasks?.reduce((acc: Record<string, number>, task) => {
    const status = task.status || 'قيد التخطيط';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}) || {};

  const taskStatusData = Object.keys(taskStatusCount).map((key) => ({
    name: key,
    count: taskStatusCount[key],
  }));

  return (
    <div className="container h-full w-full bg-transparent mx-auto px-8 py-8 max-w-7xl">
      <Header name="لوحة معلومات إدارة المشاريع" />
      
      {/* Project Selection Dropdown */}
      <div className="mb-6">
        <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          اختر المشروع:
        </label>
        <select
          id="project-select"
          value={selectedProjectId}
          onChange={handleProjectChange}
          className="block w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-dark-secondary dark:text-white"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* --- Chart 1: Task Priority Distribution --- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            توزيع المهام حسب الأهمية - {selectedProjectName}
          </h3>
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

        {/* --- Chart 2: Task Status Distribution --- */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            توزيع المهام حسب الحالة - {selectedProjectName}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={taskStatusData} 
                dataKey="count" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100}
                label={({ name, count }) => `${name}: ${count}`}
              >
                {taskStatusData.map((entry, index) => (
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
          <TasksTable
            projectId={selectedProjectId}
            showBulkActions={true}
            compact={false}
            title={`مهام المشروع: ${selectedProjectName}`}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
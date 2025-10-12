import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode, Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // Status → colors mapping
  const statusColors: Record<string, { bg: string; progress: string }> = {
    "مكتملة": { bg: "#16a34a", progress: "#22c55e" },        // Green
    "قيد التنفيذ": { bg: "#eab308", progress: "#facc15" },   // Yellow
    "قيد المراجعة": { bg: "#0ea5e9", progress: "#38bdf8" },  // Blue
    "قيد التخطيط": { bg: "#6b7280", progress: "#9ca3af" },   // Gray
  };

  const ganttTasks: GanttTask[] = useMemo(() => {
    return (
      tasks?.map((task) => {
        const colors = statusColors[task.status || "قيد التخطيط"] || { bg: "#6b7280", progress: "#9ca3af" };
        return {
          start: new Date(task.startDate as string),
          end: new Date(task.dueDate as string),
          name: task.title,
          id: `Task-${task.id}`,
          type: "task" as TaskTypeItems,
          progress: task.points ? (task.points / 10) * 100 : 0,
          isDisabled: false,
          styles: {
            backgroundColor: colors.bg,
            backgroundSelectedColor: colors.bg,
            progressColor: colors.progress,
            progressSelectedColor: colors.progress,
          },
        };
      }) || []
    );
  }, [tasks]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error || !tasks) return <div>حدث خطأ أثناء جلب المهام</div>;

  return (
    <div className="px-4 xl:px-6">
      {/* Header & View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
          <Header name="جدول زمني للمهام" isSmallText buttonComponent={
            <button 
                className='flex items-center bg-blue-primary rounded-md px-3 py-2 text-white hover:bg-blue-600'
                onClick={() => setIsModalNewTaskOpen(true)}    
            >
                أضف مهمة
            </button>
          }/>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {Object.entries(statusColors).map(([status, colors]) => (
          <div key={status} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors.bg }}
            ></span>
            <span className="text-sm">{status}</span>
          </div>
        ))}
      </div>

      {/* Gantt Chart */}
      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div style={{ direction: "ltr" }} className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

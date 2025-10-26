"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import {
  DisplayOption,
  Gantt,
  ViewMode,
  Task as GanttTask,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // Status → colors mapping
  const statusColors: Record<string, { bg: string; progress: string }> = {
    مكتملة: { bg: "#16a34a", progress: "#22c55e" }, // Green
    "قيد التنفيذ": { bg: "#eab308", progress: "#facc15" }, // Yellow
    "قيد المراجعة": { bg: "#0ea5e9", progress: "#38bdf8" }, // Blue
    "قيد التخطيط": { bg: "#6b7280", progress: "#9ca3af" }, // Gray
  };

  const ganttTasks: GanttTask[] = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false,
      })) || []
    );
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>جاري التحميل...</div>;
  if (isError || !projects) return <div>حدث خطأ أثناء جلب المشاريع</div>;

  return (
    <div className="max-w-full p-8">
      {/* Header & View Mode */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Header name="جدول زمني للمشاريع" />
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
      </header>

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

      {/* ✅ Gantt Chart with responsive horizontal scroll */}
      <div className="rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div
          style={{ direction: "ltr" }}
          className="timeline-container overflow-x-auto overflow-y-hidden"
        >
          {/* Force full horizontal width for smaller screens */}
          <div className="min-w-[700px] sm:min-w-full">
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={
                displayOptions.viewMode === ViewMode.Month ? 150 : 100
              }
              listCellWidth="150px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

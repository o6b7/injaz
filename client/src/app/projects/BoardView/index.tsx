"use client";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
  useAddCommentMutation,
  useGetCommentsQuery,
  Task as TaskType,
  useGetAuthUserQuery,
} from "@/state/api";
import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { EllipsisVertical, MessageSquareMore, Plus, Send } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

const isTouchDevice = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const getBackend = () => (isTouchDevice() ? TouchBackend : HTML5Backend);
const backendOptions = { enableMouseEvents: true, enableKeyboardEvents: true };

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["قيد التخطيط", "قيد التنفيذ", "قيد المراجعة", "مكتملة"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const { data: tasks, isLoading, error, refetch } = useGetTasksQuery({
    projectId: Number(id),
  });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ أثناء جلب المهام</div>;

  return (
    <DndProvider backend={getBackend()} options={isTouchDevice() ? backendOptions : undefined}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            refetchTasks={refetch}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  refetchTasks: () => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  refetchTasks,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const setDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) drop(node);
    },
    [drop]
  );

  const tasksCount = tasks.filter((task) => task.status === status).length;
  const statusColor: Record<string, string> = {
    "قيد التخطيط": "#2563EB",
    "قيد التنفيذ": "#059669",
    "قيد المراجعة": "#D97706",
    "مكتملة": "#000000",
  };

  return (
    <div
      ref={setDropRef}
      className={`rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div className="w-2 rounded-s-lg" style={{ backgroundColor: statusColor[status] }} />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}
            <span
              className="mr-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} refetchTasks={refetchTasks} />
        ))}
    </div>
  );
};

type TaskProps = { task: TaskType; refetchTasks: () => void };

const Task = ({ task, refetchTasks }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [addComment, { isLoading: adding }] = useAddCommentMutation();
  const { data: comments, refetch: refetchComments } = useGetCommentsQuery(task.id);
  const { data: authUser } = useGetAuthUserQuery({});
  
    const handleAddComment = async () => {
    if (!newComment.trim() || !authUser?.userSub) return;
    console.log(authUser);
    console.log(authUser.userSub);
    
    await addComment({ 
        taskId: task.id, 
        text: newComment, 
        userSub: authUser.userSub, 
    });
    setNewComment("");
    refetchComments();
    };

  const setDragRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) drag(node);
    },
    [drag]
  );

  const toggleComments = () => setShowComments((prev) => !prev);

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];
  const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : "";
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : "";
  const numberOfComments = comments?.length ?? 0;

  return (
    <div
      ref={setDragRef}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary transition-all duration-300 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{ touchAction: "none", cursor: "grab" }}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`https://injaz-s3-images.s3.eu-north-1.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}

      <div className="p-4 md:p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            {taskTagsSplit.map((tag) => (
              <div key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs">
                {tag}
              </div>
            ))}
          </div>
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">{task.points} pts</div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        <p className="text-xs text-gray-600 dark:text-neutral-400 mt-2">{task.description}</p>

        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`https://injaz-s3-images.s3.eu-north-1.amazonaws.com/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>

          <button
            onClick={toggleComments}
            className="flex items-center text-gray-500 dark:text-neutral-400 transition-colors hover:text-blue-600"
          >
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm">{numberOfComments}</span>
          </button>
        </div>

        {/* ✅ Comments */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showComments ? "max-h-[30rem] opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          {comments && comments.length > 0 ? (
            <div className="mt-2 space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-md bg-gray-100 p-2 text-sm dark:bg-dark-tertiary dark:text-white"
                >
                  <p className="font-semibold">{comment.user?.username}</p>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">لا توجد تعليقات بعد.</p>
          )}

          {/* Add Comment Input */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="أضف تعليقًا..."
              className="flex-1 rounded-lg border border-gray-300 bg-white p-2 text-sm dark:bg-dark-tertiary dark:text-white"
            />
            <button
              onClick={handleAddComment}
              disabled={adding}
              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PriorityTag inside Task
const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => {
  const priorityColors: Record<string, { bg: string; text: string }> = {
    عاجلة: { bg: "bg-red-200", text: "text-red-700" },
    مرتفعة: { bg: "bg-yellow-200", text: "text-yellow-700" },
    متوسطة: { bg: "bg-green-200", text: "text-green-700" },
    منخفضة: { bg: "bg-blue-200", text: "text-blue-700" },
    "قائمة الانتظار": { bg: "bg-gray-200", text: "text-gray-700" },
  };
  const colors = priorityColors[priority as string] ?? priorityColors["قائمة الانتظار"];
  return (
    <div className={`rounded-full px-2 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}>
      {priority ?? "قائمة الانتظار"}
    </div>
  );
};

export default BoardView;

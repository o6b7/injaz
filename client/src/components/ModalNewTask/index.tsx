import Modal from "@/components/Modal";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
};

const ModalNewTask = ({ isOpen, onClose, projectId }: Props) => {
  const [createTask, {isLoading}] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const handleSubmit = async () => {
    if (!title || !authorUserId || !projectId) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    await createTask({
      title: title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      projectId: projectId !== null ? Number(projectId) : Number(projectId),
    });
  };

  const isFormValid = () => {
    return title && description && startDate && dueDate;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="إنشاء مهمة جديد">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="عنوان المهمة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="وصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select 
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(Status[e.target.value as keyof typeof Status])}    
            >
                <option value="">اختر حالة المهمة</option>
                <option value={Status.ToDo}>قيد التخطيط</option>
                <option value={Status.WorkInProgress}>قيد التنفيذ</option>
                <option value={Status.UnderReview}>قيد المراجعة</option>
                <option value={Status.Comlpleted}>مكتملة</option>
            </select>
            <select 
                className={selectStyles}
                value={priority}
                onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}    
            >
                <option value="">اختر مدى أهمية المهمة</option>
                <option value={Priority.Urgent}>عاجلة</option>
                <option value={Priority.High}>مرتفعة</option>
                <option value={Priority.Medium}>متوسطة</option>
                <option value={Priority.Backlog}>قائمة الانتظار</option>
            </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="علامات(افصلهم بفواصل انجليزية [,])"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
            <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            />
            <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            />
            <input
            type="text"
            className={inputStyles}
            placeholder="يوزر المُنشئ"
            value={authorUserId}
            onChange={(e) => setAuthorUserId(e.target.value)}
            />
            <input
            type="text"
            className={inputStyles}
            placeholder="يوزر المُكلف بالمهمة"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            />
        </div>
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "جاري إنشاء المشروع..." : "أنشئ المشروع"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;

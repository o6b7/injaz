import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { ProjectOptions } from "next/dist/build/swc";
import { headers } from "next/headers";

export interface Project {
  id: number;
  name: string;
  description?: string; 
  startDate?: string;
  endDate?: string;
}

export enum Status {
  ToDo = "قيد التخطيط",
  WorkInProgress = "قيد التنفيذ",
  UnderReview = "قيد المراجعة",
  Comlpleted = "مكتملة",
}

export enum Priority {
  Urgent = "عاجلة",
  High = "مرتفعة",
  Medium = "متوسطة",
  Low = "منخفضة",
  Backlog = "قائمة الانتظار",
}

export interface User {
 userId?: number,
 username: string;
 email: string;
 profilePictureUrl?: string;
 cognitoId?: string;
 teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

type TaskComment = {
  id: string;
  text: string;
  user: {
    username: string;
  };
};

export interface Task {
  id: number;
  title: string; 
  description?: string; 
  status?: Status; 
  priority?: Priority; 
  tags?: string; 
  startDate?: string; 
  dueDate?: string; 
  points?: number; 
  projectId: number; 
  authorUserId?: number; 
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: TaskComment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { accessToken } = session.tokens ?? {};
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Comments"],
  endpoints: (build) => ({
    getAuthUser: build.query({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          if(!session) throw new Error("No session found");
          const { userSub } = session;
          const { accessToken } = session.tokens ?? {};

          const userDetailsResponse = await fetchWithBQ(`users/${userSub}`)
          const userDetails = userDetailsResponse.data as User;

          return { data: {user, userSub, userDetails} }
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" }
        }
      }
    }),

    // Projects
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project
      }),
      invalidatesTags: ["Projects"]
    }),

    // Tasks
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      transformResponse: (response: Task[]) => {
        const statusMap: Record<string, Status> = {
          "To Do": Status.ToDo,
          "Work In Progress": Status.WorkInProgress,
          "In Review": Status.UnderReview,
          "Completed": Status.Comlpleted,
        };
        
        return response.map((task) => {
          let convertedStatus: Status | undefined = undefined;
          
          if (task.status) {
            convertedStatus = statusMap[task.status] || 
                            (Object.values(Status).includes(task.status as Status) 
                              ? task.status as Status 
                              : undefined);
          }
          
          return {
            ...task,
            status: convertedStatus,
          };
        });
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) => result?result.map(({ id }) => ({ type: "Tasks", id}))
      : [{type: "Tasks", id: userId}]
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task
      }),
      invalidatesTags: ["Tasks"]
    }),
    updateTaskStatus: build.mutation<Task, {taskId: number, status: string}>({
      query: ({taskId, status}) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: {status}
      }),
      invalidatesTags: (result, error, {taskId}) => [
        { type: "Tasks", id: taskId }
      ]
    }),

    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"]
    }),

    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    
    addComment: build.mutation<
      any, // or define a Comment type
      { taskId: number; text: string; userSub: string }
    >({
      query: ({ taskId, text, userSub }) => ({
        url: `tasks/${taskId}/comments`,
        method: "POST",
        body: { text, userSub },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
      ],
    }),

    getComments: build.query<TaskComment[], number>({
      query: (taskId) => `tasks/${taskId}/comments`,
      transformResponse: (response: { success: boolean; data: TaskComment[]; count: number }) => response.data,
      providesTags: (result, error, taskId) => [
        { type: "Comments", id: taskId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
} = api;

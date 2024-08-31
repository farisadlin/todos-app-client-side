"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import TaskList from "@/components/TaskList";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomeContent() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const { data, isLoading, error, refetch } = useTasks({ limit: 5, page });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    router.push(`/?page=${newPage}`);
  };

  const addTaskMutation = useMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => axiosInstance.post("/task/create", { title, description }),
    onSuccess: () => refetch(),
  });

  const editTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      newTitle,
      newDescription,
    }: {
      taskId: number;
      newTitle: string;
      newDescription: string;
    }) =>
      axiosInstance.put(`/task/update/${taskId}`, {
        title: newTitle,
        description: newDescription,
      }),
    onSuccess: () => refetch(),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) =>
      axiosInstance.delete(`/task/delete/${taskId}`),
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({
      taskId,
      completed,
    }: {
      taskId: number;
      completed: boolean;
    }) => axiosInstance.put(`/task/update/status/${taskId}`, { completed }),
    onSuccess: () => refetch(),
  });

  const handleUpdateTaskStatus = (taskId: number, completed: boolean) => {
    updateTaskStatusMutation.mutate({ taskId, completed });
  };

  const handleAddTask = (title: string, description: string) => {
    addTaskMutation.mutate({ title, description });
  };

  const handleEditTask = (
    taskId: number,
    newTitle: string,
    newDescription: string
  ) => {
    editTaskMutation.mutate({ taskId, newTitle, newDescription });
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTaskMutation.mutateAsync(taskId);
    const updatedData = await refetch();

    if (updatedData.data?.tasks.length === 0 && page > 1) {
      const newPage = page - 1;
      router.push(`/?page=${newPage}`);
    }
  };

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <div className="max-md:mx-4">
      <Navigation isLoggedIn={Boolean(token)} />
      <Header title="TODOS APP WITH NODE.JS" />
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p>Error fetching tasks</p>
      ) : (
        <TaskList
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          tasks={data?.tasks}
          pagination={
            data?.pagination ?? {
              current_page: page,
              total_pages: 1,
              total_items: 1,
              items_per_page: 1,
            }
          }
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

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

export default function HomeContent() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useTasks({ limit: 5, page });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setPage(newPage);
    refetch();
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
    mutationFn: ({ taskId, newTitle }: { taskId: number; newTitle: string }) =>
      axiosInstance.put(`/task/${taskId}`, { title: newTitle }),
    onSuccess: () => refetch(),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) =>
      axiosInstance.delete(`/task/delete/${taskId}`),
    onSuccess: () => refetch(),
  });

  const handleAddTask = (title: string, description: string) => {
    addTaskMutation.mutate({ title, description });
  };

  const handleEditTask = (taskId: number, newTitle: string) => {
    editTaskMutation.mutate({ taskId, newTitle });
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <>
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
          tasks={data?.tasks}
          pagination={
            data?.pagination ?? {
              current_page: 1,
              total_pages: 1,
              total_items: 1,
              items_per_page: 1,
            }
          }
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

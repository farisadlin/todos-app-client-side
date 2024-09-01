"use client";

import { useTasks } from "@/hooks/useTasks";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "./Navigation";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const [isClient, setIsClient] = useState(false);
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );

  const { data, isLoading, error, refetch } = useTasks({
    limit: 5,
    page,
    completed,
    search,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    router.push(
      `/?page=${newPage}${search !== "" ? `&search=${search}` : ""}${
        completed !== null ? `&completed=${completed}` : ""
      }`
    );
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

  const debouncedSearch = useDebounce(search, 300); // 300ms debounce time

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, completed]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    router.push(
      `/?page=${page}${newSearch !== "" ? `&search=${newSearch}` : ""}${
        completed !== null ? `&completed=${completed}` : ""
      }`
    );
  };

  const handleFilterCompleted = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCompleted =
      e.target.value === "" ? null : e.target.value === "true";
    setCompleted(newCompleted);
    router.push(
      `/?page=${page}${search !== "" ? `&search=${search}` : ""}${
        newCompleted !== null ? `&completed=${newCompleted}` : ""
      }`
    );
  };

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <>
      <Navigation />
      <div className="max-md:mx-4 max-md:pb-6">
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
          onSearchChange={handleSearchChange}
          onFilterCompleted={handleFilterCompleted}
          completed={completed}
          isLoading={isLoading}
          isError={!!error}
          searchValue={search}
        />
      </div>
    </>
  );
}

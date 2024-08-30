"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { Pagination, Task } from "@/types";
import { getCookie } from "cookies-next";

const fetchTasks = async (
  queryParams: Record<string, any>
): Promise<{
  tasks: Task[];
  pagination: Pagination;
}> => {
  const { data } = await axiosInstance.get("/task/get/all", {
    params: queryParams,
  });
  return data;
};

export const useTasks = (queryParams: Record<string, any> = {}) => {
  const token = getCookie("token");

  return useQuery<{ tasks: Task[]; pagination: Pagination }, Error>({
    queryKey: ["tasks", token, queryParams],
    queryFn: () => fetchTasks(queryParams),
    enabled: Boolean(token),
  });
};

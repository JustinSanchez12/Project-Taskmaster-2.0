import { useState, useCallback } from "react";
import type { Task, TaskCreate, TaskUpdate } from "../types/task";
import * as api from "../api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listTasks(startDate, endDate);
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (payload: TaskCreate): Promise<Task> => {
    const task = await api.createTask(payload);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const patchTask = useCallback(async (id: string, payload: TaskUpdate): Promise<Task> => {
    const updated = await api.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id: string): Promise<void> => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, fetchTasks, addTask, patchTask, removeTask };
}

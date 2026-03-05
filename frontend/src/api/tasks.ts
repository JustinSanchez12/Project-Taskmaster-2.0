import type { Task, TaskCreate, TaskUpdate } from "../types/task";

const BASE = "/api/v1/tasks";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function listTasks(startDate?: string, endDate?: string): Promise<Task[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const url = params.toString() ? `${BASE}/?${params}` : `${BASE}/`;
  const res = await fetch(url);
  return handleResponse<Task[]>(res);
}

export async function createTask(payload: TaskCreate): Promise<Task> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(id: string, payload: TaskUpdate): Promise<Task> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handleResponse<void>(res);
}

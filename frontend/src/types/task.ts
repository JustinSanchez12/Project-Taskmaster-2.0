export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW" | "OPTIONAL";

export interface Task {
  id: string;
  title: string;
  scheduled_date: string; // ISO date string "YYYY-MM-DD"
  is_complete: boolean;
  completed_at: string | null;
  description: string | null;
  priority: Priority | null;
  scheduled_time: string | null;
  due_date: string | null;
  ai_notes: string | null;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  scheduled_date: string;
  scheduled_time?: string;  // ISO datetime string
  end_date?: string;        // last day for multi-day tasks "YYYY-MM-DD"
  description?: string;
  priority?: Priority;
}

export interface TaskUpdate {
  title?: string;
  scheduled_date?: string;
  scheduled_time?: string;  // ISO datetime string
  end_date?: string;        // last day for multi-day tasks "YYYY-MM-DD"
  is_complete?: boolean;
  description?: string;
  priority?: Priority;
  is_locked?: boolean;
}

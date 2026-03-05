import { useState } from "react";
import type { Task, TaskCreate, TaskUpdate, Priority } from "../../types/task";
import { TaskItem } from "../TaskItem/TaskItem";
import "./TaskModal.css";

interface Props {
  date: string; // "YYYY-MM-DD"
  tasks: Task[];
  onAdd: (payload: TaskCreate) => Promise<void>;
  onToggle: (id: string, payload: TaskUpdate) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const PRIORITIES: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW", "OPTIONAL"];

export function TaskModal({ date, tasks, onAdd, onToggle, onDelete, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({ title: title.trim(), scheduled_date: date, priority: priority || undefined });
      setTitle("");
      setPriority("");
    } finally {
      setSubmitting(false);
    }
  };

  const displayDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{displayDate}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks for this day.</p>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))
          )}
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | "")}>
            <option value="">Priority (optional)</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button type="submit" disabled={!title.trim() || submitting}>
            {submitting ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}

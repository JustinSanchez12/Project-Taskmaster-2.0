import { useState } from "react";
import type { Task, TaskCreate, TaskUpdate, Priority } from "../../types/task";
import { TaskItem } from "../TaskItem/TaskItem";
import "./TaskModal.css";

interface Props {
  date: string; // "YYYY-MM-DD"
  tasks: Task[];
  onAdd: (payload: TaskCreate) => Promise<void>;
  onUpdate: (id: string, payload: TaskUpdate) => Promise<void>;
  onToggle: (id: string, payload: TaskUpdate) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const PRIORITIES: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW", "OPTIONAL"];

// Convert an ISO datetime string to "HH:MM" for <input type="time">
function toTimeInput(isoDatetime: string | null): string {
  if (!isoDatetime) return "";
  const d = new Date(isoDatetime);
  return d.toTimeString().slice(0, 5); // "HH:MM"
}

// Build an ISO datetime string from a date string + "HH:MM" time string
function toISODatetime(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`;
}

export function TaskModal({ date, tasks, onAdd, onUpdate, onToggle, onDelete, onClose }: Props) {
  // --- Create form state ---
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- Edit form state ---
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editPriority, setEditPriority] = useState<Priority | "">("");
  const [editDescription, setEditDescription] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        scheduled_date: date,
        scheduled_time: time ? toISODatetime(date, time) : undefined,
        end_date: endDate || undefined,
        priority: priority || undefined,
      });
      setTitle("");
      setPriority("");
      setTime("");
      setEndDate("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDate(task.scheduled_date);
    setEditTime(toTimeInput(task.scheduled_time));
    setEditEndDate(task.due_date ?? "");
    setEditPriority(task.priority ?? "");
    setEditDescription(task.description ?? "");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;
    setEditSubmitting(true);
    try {
      await onUpdate(editingTask.id, {
        title: editTitle.trim(),
        scheduled_date: editDate,
        scheduled_time: editTime ? toISODatetime(editDate, editTime) : undefined,
        end_date: editEndDate || undefined,
        priority: editPriority || undefined,
        description: editDescription || undefined,
      });
      setEditingTask(null);
    } finally {
      setEditSubmitting(false);
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
          <h2>{editingTask ? "Edit Task" : displayDate}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {editingTask ? (
          /* ── Edit form ── */
          <form className="modal-edit-form" onSubmit={handleEditSubmit}>
            <label>
              Title
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
            </label>
            <div className="form-row">
              <label>
                Date
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </label>
              <label>
                Time
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </label>
            </div>
            <label>
              End Date <span className="field-hint">(multi-day, optional)</span>
              <input
                type="date"
                value={editEndDate}
                min={editDate}
                onChange={(e) => setEditEndDate(e.target.value)}
              />
            </label>
            <label>
              Priority
              <select value={editPriority} onChange={(e) => setEditPriority(e.target.value as Priority | "")}>
                <option value="">None</option>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label>
              Description
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                placeholder="Optional notes..."
              />
            </label>
            <div className="edit-actions">
              <button type="button" className="btn-cancel" onClick={() => setEditingTask(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={!editTitle.trim() || editSubmitting}>
                {editSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* ── Task list ── */}
            <div className="modal-body">
              {tasks.length === 0 ? (
                <p className="no-tasks">No tasks for this day.</p>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={handleEditOpen}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>

            {/* ── Create form ── */}
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="create-form-fields">
                <div className="create-row-main">
                  <input
                    type="text"
                    placeholder="Add a task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                  <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | "")}>
                    <option value="">Priority</option>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="create-row-extra">
                  <label className="inline-label">
                    <span>Time</span>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </label>
                  <label className="inline-label">
                    <span>End date</span>
                    <input
                      type="date"
                      value={endDate}
                      min={date}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </label>
                </div>
              </div>
              <button type="submit" disabled={!title.trim() || submitting}>
                {submitting ? "Adding..." : "Add"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

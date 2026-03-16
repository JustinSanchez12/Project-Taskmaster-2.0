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

// Extract "YYYY-MM-DD" from an ISO datetime string
function toDateInput(isoDatetime: string | null): string {
  if (!isoDatetime) return "";
  return isoDatetime.slice(0, 10);
}

// Build an ISO datetime string from a date string + "HH:MM" time string
function toISODatetime(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`;
}

export function TaskModal({ date, tasks, onAdd, onUpdate, onToggle, onDelete, onClose }: Props) {
  // --- Create form state ---
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- Edit form state ---
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
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
        scheduled_time: startTime ? toISODatetime(date, startTime) : undefined,
        // Combine end date + end time into scheduled_end_time; fall back to end date alone at midnight
        scheduled_end_time: endDate && endTime ? toISODatetime(endDate, endTime) : undefined,
        end_date: endDate || undefined,
        priority: priority || undefined,
      });
      setTitle("");
      setPriority("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDate(task.scheduled_date);
    setEditStartTime(toTimeInput(task.scheduled_time));
    setEditEndDate(task.due_date ?? toDateInput(task.scheduled_end_time));
    setEditEndTime(toTimeInput(task.scheduled_end_time));
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
        scheduled_time: editStartTime ? toISODatetime(editDate, editStartTime) : undefined,
        scheduled_end_time: editEndDate && editEndTime ? toISODatetime(editEndDate, editEndTime) : undefined,
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
                Start Date
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </label>
              <label>
                Start Time
                <input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                End Date <span className="field-hint">(optional)</span>
                <input
                  type="date"
                  value={editEndDate}
                  min={editDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </label>
              <label>
                End Time <span className="field-hint">(optional)</span>
                <input
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                />
              </label>
            </div>
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
                    <span>Start Time</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
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
                  <label className="inline-label">
                    <span>End Time</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
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

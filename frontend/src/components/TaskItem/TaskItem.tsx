import type { Task, TaskUpdate } from "../../types/task";
import "./TaskItem.css";

interface Props {
  task: Task;
  onToggle: (id: string, payload: TaskUpdate) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function fmt(isoDatetime: string): string {
  return new Date(isoDatetime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatTimeRange(start: string | null, end: string | null): string | null {
  if (!start) return null;
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const timeLabel = formatTimeRange(task.scheduled_time, task.scheduled_end_time);

  return (
    <div className={`task-item ${task.is_complete ? "complete" : ""}`}>
      <input
        type="checkbox"
        checked={task.is_complete}
        onChange={() => onToggle(task.id, { is_complete: !task.is_complete })}
      />
      <div className="task-main">
        <span className="task-title">{task.title}</span>
        {timeLabel && <span className="task-time">{timeLabel}</span>}
      </div>
      {task.priority && (
        <span className={`priority priority--${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      )}
      <button className="edit-btn" onClick={() => onEdit(task)} aria-label="Edit task">
        ✎
      </button>
      <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete task">
        ×
      </button>
    </div>
  );
}

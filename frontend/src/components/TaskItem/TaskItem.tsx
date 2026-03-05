import type { Task, TaskUpdate } from "../../types/task";
import "./TaskItem.css";

interface Props {
  task: Task;
  onToggle: (id: string, payload: TaskUpdate) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <div className={`task-item ${task.is_complete ? "complete" : ""}`}>
      <input
        type="checkbox"
        checked={task.is_complete}
        onChange={() => onToggle(task.id, { is_complete: !task.is_complete })}
      />
      <span className="task-title">{task.title}</span>
      {task.priority && <span className={`priority priority--${task.priority.toLowerCase()}`}>{task.priority}</span>}
      <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete task">
        ×
      </button>
    </div>
  );
}

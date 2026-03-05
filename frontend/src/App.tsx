import { useState, useCallback } from "react";
import { CalendarView } from "./components/Calendar/CalendarView";
import { TaskModal } from "./components/TaskModal/TaskModal";
import { useTasks } from "./hooks/useTasks";
import type { TaskCreate, TaskUpdate } from "./types/task";
import "./App.css";

export default function App() {
  const { tasks, fetchTasks, addTask, patchTask, removeTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDatesChange = useCallback(
    (start: string, end: string) => {
      fetchTasks(start, end);
    },
    [fetchTasks]
  );

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleAdd = async (payload: TaskCreate) => {
    await addTask(payload);
  };

  const handleToggle = (id: string, payload: TaskUpdate) => {
    patchTask(id, payload);
  };

  const handleDelete = (id: string) => {
    removeTask(id);
  };

  const tasksForSelectedDate = selectedDate
    ? tasks.filter((t) => t.scheduled_date === selectedDate)
    : [];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Taskmaster</h1>
      </header>

      <main>
        <CalendarView
          tasks={tasks}
          onDateClick={handleDateClick}
          onDatesChange={handleDatesChange}
        />
      </main>

      {selectedDate && (
        <TaskModal
          date={selectedDate}
          tasks={tasksForSelectedDate}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { DatesSetArg, EventInput } from "@fullcalendar/core";
import type { Task } from "../../types/task";
import "./CalendarView.css";

interface Props {
  tasks: Task[];
  onDateClick: (date: string) => void;
  onDatesChange: (startDate: string, endDate: string) => void;
}

function addOneDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function taskToEvent(task: Task): EventInput {
  return {
    id: task.id,
    title: task.title,
    start: task.scheduled_date,
    // FullCalendar end is exclusive, so +1 day to include due_date itself
    end: task.due_date ? addOneDay(task.due_date) : undefined,
    allDay: true,
    classNames: [
      task.is_complete ? "event--complete" : "event--pending",
      task.priority ? `event--${task.priority.toLowerCase()}` : "",
    ].filter(Boolean),
    extendedProps: { task },
  };
}

export function CalendarView({ tasks, onDateClick, onDatesChange }: Props) {
  const events = tasks.map(taskToEvent);

  const handleDateClick = (arg: DateClickArg) => {
    onDateClick(arg.dateStr);
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = arg.startStr.split("T")[0];
    const end = arg.endStr.split("T")[0];
    onDatesChange(start, end);
  };

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
        events={events}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        eventDisplay="block"
        dayMaxEvents={3}
      />
    </div>
  );
}

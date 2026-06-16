import EventCard from "@/components/calendar/EventCard";

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  type: string;
};

type UpcomingEventsListProps = {
  events: CalendarEvent[];
};

export default function UpcomingEventsList({
  events,
}: UpcomingEventsListProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
}
import EventCard from "@/components/calendar/EventCard";
import type { EventRecord } from "@/lib/mock-data";

type UpcomingEventsListProps = {
  events: EventRecord[];
};

export default function UpcomingEventsList({
  events,
}: UpcomingEventsListProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

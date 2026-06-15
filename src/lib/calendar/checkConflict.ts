import { getWeekEvents } from "./getWeekEvents";

export async function checkConflict(
  start: string,
  end: string
) {
const events =
  await getWeekEvents(
    "default"
  );

  const newStart =
    new Date(start);

  const newEnd =
    new Date(end);

  const conflict =
    events.find((event) => {
      const eventStart =
  event.data?.start?.dateTime;

const eventEnd =
  event.data?.end?.dateTime;

      if (
        !eventStart ||
        !eventEnd
      ) {
        return false;
      }

      return (
        newStart <
          new Date(
            eventEnd
          ) &&
        newEnd >
          new Date(
            eventStart
          )
      );
    });

  return conflict;
}
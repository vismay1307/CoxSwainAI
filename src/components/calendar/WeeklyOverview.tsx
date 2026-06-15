import { Card, CardContent } from "@/components/ui/Card";
import { weeklyOverview } from "@/lib/mock-data";

export default function WeeklyOverview() {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Weekly overview</h2>
            <p className="text-sm text-muted-foreground">See where focus time survives the week.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {weeklyOverview.map((day) => (
            <div key={day.day} className="rounded-[1.5rem] bg-secondary/70 p-4">
              <p className="text-sm font-semibold">{day.day}</p>
              <p className="mt-3 text-sm text-foreground">{day.focus}</p>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>{day.meetings} meetings</p>
                <p>{day.freeHours}h free</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

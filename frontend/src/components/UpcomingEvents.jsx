import {
  ChevronRight,
  Calendar,
  Users,
  CalendarDays,
} from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "AI/ML Code Camp",
    date: "Dec 01",
    type: "Virtual",
    attendees: "3,000+",
  },
  {
    id: 2,
    title: "Global UI/UX Design Jam",
    date: "Dec 10",
    type: "New York, NY",
    attendees: "450+",
  },
  {
    id: 3,
    title: "Cloud Native Meetup",
    date: "Dec 18",
    type: "Virtual",
    attendees: "900+",
  },
];

export default function UpcomingEvents() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <CalendarDays size={18} strokeWidth={2} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Upcoming Events
          </h3>
          <p className="text-xs text-slate-500">
            Don't miss these events
          </p>
        </div>
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-3">
        {upcomingEvents.map((event) => {
          const [month, day] = event.date.split(" ");

          return (
            <div
              key={event.id}
              className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:border-violet-200 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left */}
              <div className="flex min-w-0 flex-1 items-center gap-3">

                {/* Date Badge */}
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    {month}
                  </span>

                  <span className="text-sm font-bold text-slate-800 group-hover:text-violet-600">
                    {day}
                  </span>
                </div>

                {/* Event Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-violet-700 sm:whitespace-normal">
                    {event.title}
                  </h4>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {event.type}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {event.attendees}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="self-end sm:self-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-violet-100 group-hover:text-violet-600">
                  <ChevronRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Button */}
      <button className="mt-4 w-full border rounded border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-[0.98]">
        View All Upcoming Events
      </button>
    </div>
  );
}
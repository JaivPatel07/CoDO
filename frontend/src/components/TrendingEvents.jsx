import {
  ChevronRight,
  Sparkles,
  Calendar,
  Users,
} from "lucide-react";

const trendingevents = [
  {
    id: 4,
    title: "AI/ML Code Camp",
    date: "Dec 01",
    type: "Virtual",
    attendees: "3,000+",
  },
  {
    id: 5,
    title: "Global UI/UX Design Jam",
    date: "Dec 10",
    type: "New York, NY",
    attendees: "450+",
  },
  {
    id: 6,
    title: "Cloud Native Meetup",
    date: "Dec 18",
    type: "Virtual",
    attendees: "900+",
  },
];

export default function TrendingEvents() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Sparkles size={18} strokeWidth={2} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Trending Events
          </h3>
          <p className="text-xs text-slate-500">
            Most popular this week
          </p>
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-3">
        {trendingevents.map((event) => {
          const [month, day] = event.date.split(" ");

          return (
            <div
              key={event.id}
              className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3 flex-1">

                {/* Date */}
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    {month}
                  </span>

                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">
                    {day}
                  </span>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-700 sm:whitespace-normal">
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
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600">
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

      {/* Button */}
      <button className="mt-4 w-full border rounded border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98]">
        View All Trending Events
      </button>
    </div>
  );
}
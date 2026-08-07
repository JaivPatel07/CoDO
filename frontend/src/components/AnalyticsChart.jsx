import React, { useMemo, useState } from "react";
import { Eye, Users, UserPlus, TrendingUp, TrendingDown } from "lucide-react";

// ─────────────────────────────────────────────
// METRIC DEFINITIONS
// ─────────────────────────────────────────────
const METRICS = [
  {
    key: "profile_views",
    label: "Profile Views",
    icon: Eye,
    color: "bg-violet-500",
    barColor: "#8B5CF6",
    legendClass: "bg-violet-500",
  },
  {
    key: "followers",
    label: "Followers",
    icon: Users,
    color: "bg-emerald-500",
    barColor: "#10B981",
    legendClass: "bg-emerald-500",
  },
  {
    key: "registrations",
    label: "Registrations",
    icon: UserPlus,
    color: "bg-amber-500",
    barColor: "#F59E0B",
    legendClass: "bg-amber-500",
  },
];

const fmt = (v) => new Intl.NumberFormat("en-US").format(v || 0);

// ─────────────────────────────────────────────
// ANALYTICS CHART COMPONENT
// ─────────────────────────────────────────────
export default function AnalyticsChart({ data = [] }) {
  const [activeKey, setActiveKey] = useState(METRICS[0].key);
  const activeMetric = METRICS.find((m) => m.key === activeKey) || METRICS[0];

  const months = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.slice(-12);
  }, [data]);

  const values = useMemo(
    () => months.map((m) => m?.[activeKey] || 0),
    [months, activeKey]
  );

  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  const current = values[values.length - 1] || 0;
  const previous = values[values.length - 2] || 0;
  const growth =
    previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  const GrowingIcon = growth >= 0 ? TrendingUp : TrendingDown;
  const growthColor = growth >= 0 ? "text-emerald-600" : "text-red-500";

if (months.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Analytics Overview</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Track your organization's growth over the last 12 months
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-14 w-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-3 dark:bg-violet-500/10">
            <TrendingUp size={24} className="text-violet-400" />
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No analytics data yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
            Analytics will appear here as your organization grows.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 dark:bg-slate-900 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Analytics Overview</h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Growth over the last 12 months
          </p>
        </div>

        {/* Metric tabs */}
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((m) => {
            const Icon = m.icon;
            const isActive = m.key === activeKey;
            return (
              <button
                key={m.key}
                onClick={() => setActiveKey(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                  isActive
                    ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300"
                    : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-violet-300"
                }`}
              >
                <Icon size={13} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Total ({activeMetric.label})
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{fmt(total)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            This month
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">{fmt(current)}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <GrowingIcon size={15} className={growthColor} />
          <span className={`text-sm font-black ${growthColor}`}>
            {growth >= 0 ? "+" : ""}
            {growth}%
          </span>
          <span className="text-[11px] font-medium text-slate-400">vs last month</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 sm:gap-2 h-44">
        {months.map((m, i) => {
          const val = values[i];
          const height = Math.max((val / max) * 100, 2);
          const isLast = i === months.length - 1;
          return (
            <div
              key={m.key || i}
              className="group relative flex-1 flex flex-col items-center justify-end h-full"
            >
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-150 z-10 bg-slate-900 text-white text-[10px] font-bold rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                {m.label}: {fmt(val)}
              </div>
              <div
                className={`w-full max-w-[26px] rounded-t-lg transition-all duration-300 ${
                  isLast ? activeMetric.color : "bg-slate-200 group-hover:bg-slate-300 dark:bg-slate-700 dark:group-hover:bg-slate-600"
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X axis labels */}
      <div className="flex gap-1.5 sm:gap-2 mt-2">
        {months.map((m, i) => (
          <div key={m.key || i} className="flex-1 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">
              {m.label?.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

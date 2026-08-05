export function getEventMode(event) {
    if (event.event_mode) return event.event_mode;
    const location = (event.location || "").toLowerCase();
    if (location.includes("hybrid")) return "Hybrid";
    if (location.includes("online") || location.includes("virtual") || location.includes("remote")) return "Online";
    return "Offline";
}

export function getEventStatus(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${event.event_date}T00:00:00`);
    const end = event.end_date ? new Date(`${event.end_date}T00:00:00`) : start;
    if (start > today) return "Upcoming";
    if (start <= today && end >= today) return "Ongoing";
    return "Completed";
}

export function daysLeft(event) {
    if (!event.event_date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${event.event_date}T00:00:00`);
    return Math.ceil((start - today) / 86400000);
}

export function formatDateRange(event) {
    if (!event.event_date) return "Date not set";
    const start = new Date(`${event.event_date}T00:00:00`);
    const startText = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (!event.end_date || event.end_date === event.event_date) return startText;
    const end = new Date(`${event.end_date}T00:00:00`);
    return `${startText} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export function getDaysLeftText(event) {
    const remaining = daysLeft(event);
    if (remaining === null) return "Date pending";
    if (remaining > 1) return `${remaining} days left`;
    if (remaining === 1) return "1 day left";
    if (remaining === 0) return "Today";
    return getEventStatus(event);
}

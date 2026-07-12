export default function calculate_post_time(time) {
    const postTime = new Date(time);
    const now = new Date();

    const diff = now - postTime;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (days === 1) {
        return "Yesterday";
    }

    if (days < 30) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}
// Standardized error message banner used across all pages.
// Displays only the message text with a consistent red style.
const ErrorBanner = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      className={`rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] font-bold text-red-700 ${className}`}
    >
      {message}
    </div>
  );
};

export default ErrorBanner;

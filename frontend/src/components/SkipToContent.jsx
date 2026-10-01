/**
 * Keyboard-accessible "skip to main content" link.
 *
 * It is the first focusable element on the page, so screen-reader and keyboard
 * users can jump straight past the navigation instead of tabbing through every
 * link. Visually hidden until focused.
 */
export default function SkipToContent({ targetId = "main-content" }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:flex focus:items-center focus:gap-2 focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

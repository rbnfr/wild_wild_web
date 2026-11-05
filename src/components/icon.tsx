export function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11c-4-3-9-3-14-2v23c5-1 10-1 14 2 4-3 9-3 14-2V9c-5-1-10-1-14 2Z" />
      <path d="M20 11v23M11 15h4M25 15h4" />
    </svg>
  );
}

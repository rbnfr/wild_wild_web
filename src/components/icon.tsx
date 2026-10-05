export function Icon({
  kind,
  className = "",
}: {
  kind: string;
  className?: string;
}) {
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
      {kind === "bond" ? (
        <>
          <path d="M20 30s-12-7-12-15a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 15-12 15Z" />
          <path d="m14 20 4 4 8-8" />
        </>
      ) : kind === "talk" ? (
        <>
          <path d="M7 9h26v18H18l-8 6v-6H7Z" />
          <path d="M13 15h14M13 21h9" />
        </>
      ) : (
        <>
          <path d="M20 11c-4-3-9-3-14-2v23c5-1 10-1 14 2 4-3 9-3 14-2V9c-5-1-10-1-14 2Z" />
          <path d="M20 11v23M11 15h4M25 15h4" />
        </>
      )}
    </svg>
  );
}

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

export function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

// Line icons share one stroke so arrows, menu and mail read as one family.
function LineIcon({ size, d }: { size: number; d: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

export const ArrowUpRightIcon = ({ size = 16 }: { size?: number }) => (
  <LineIcon size={size} d="M7 17 17 7M8 7h9v9" />
);
export const ArrowDownIcon = ({ size = 22 }: { size?: number }) => (
  <LineIcon size={size} d="M12 5v14M6 13l6 6 6-6" />
);
export const MenuIcon = ({ size = 22 }: { size?: number }) => (
  <LineIcon size={size} d="M4 7h16M4 12h16M4 17h16" />
);
export const CloseIcon = ({ size = 22 }: { size?: number }) => (
  <LineIcon size={size} d="M6 6l12 12M18 6 6 18" />
);

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
export const ChevronDownIcon = ({ size = 14 }: { size?: number }) => (
  <LineIcon size={size} d="m6 9 6 6 6-6" />
);
export const MailIcon = ({ size = 20 }: { size?: number }) => (
  <LineIcon
    size={size}
    d="M5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9A2.5 2.5 0 0 1 5.5 5ZM4 7.5l8 6 8-6"
  />
);

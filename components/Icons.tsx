const base = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconInicio = () => (
  <svg {...base}>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v12h14V9M9 21v-8h6v8" />
  </svg>
);

export const IconCarnet = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4M15 10h3M15 14h3" />
  </svg>
);

export const IconCuotas = () => (
  <svg {...base}>
    <path d="M4 7h16v12H4zM4 7l2-3h12l2 3" />
    <path d="M12 11v5M10 12.5c0-.8.9-1.2 2-1.2s2 .4 2 1.2-.9 1.2-2 1.2-2 .4-2 1.2.9 1.2 2 1.2 2-.4 2-1.2" />
  </svg>
);

export const IconReservas = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconPadel = () => (
  <svg {...base}>
    <ellipse cx="10" cy="9" rx="6" ry="6.5" />
    <path d="M14.5 13.8 20 20" />
    <path d="M7 7h.01M10 6h.01M13 7h.01M8 10h.01M11 10h.01" />
  </svg>
);

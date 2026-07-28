import type { SVGProps } from "react";

/**
 * A small, single-weight line-icon set built by hand so the app doesn't
 * need an external icon library dependency. Every icon shares the same
 * viewBox, stroke width, and cap/join style for visual consistency.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSteeringWheel(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="2.1" />
      <path d="M12 9.9V6.2M8.7 13.9l-3.2 2.3M15.3 13.9l3.2 2.3" />
    </svg>
  );
}

export function IconIdCard(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.25" y="6" width="17.5" height="13" rx="2" />
      <path d="M9.25 2.75h5.5M7.25 10.25a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0ZM6.25 16c.5-1.7 2-2.4 2.75-2.4S11.25 14.3 11.75 16M14.25 10.5h4M14.25 13.5h4" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="8.75" cy="9" r="2.75" />
      <path d="M3.5 18c.6-2.8 2.7-4.25 5.25-4.25S13.4 15.2 14 18" />
      <circle cx="16.25" cy="8.25" r="2" />
      <path d="M15 13.9c1.9.1 3.6 1.35 4.1 3.85" />
    </svg>
  );
}

export function IconCup(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 9.5h10.25v5.25a4 4 0 0 1-4 4h-2.25a4 4 0 0 1-4-4V9.5Z" />
      <path d="M15.75 10.75h1.3a2.35 2.35 0 0 1 0 4.7h-1.3" />
      <path d="M8.25 5.2c.35.55.35 1.1 0 1.65M11 5.2c.35.55.35 1.1 0 1.65M13.75 5.2c.35.55.35 1.1 0 1.65" />
    </svg>
  );
}

export function IconDocumentCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.25h7.25L18.5 7.5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V4.75A1.5 1.5 0 0 1 7 3.25Z" />
      <path d="M13.75 3.25V7.5h4.25" />
      <path d="M8.5 13.25l2 2 4-4.25" />
    </svg>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.25 18.5 5.5v5.4c0 4.35-2.9 7.1-6.5 8.35-3.6-1.25-6.5-4-6.5-8.35V5.5L12 3.25Z" />
      <path d="M9 12.1l2.1 2.1 4-4.3" />
    </svg>
  );
}

export function IconWrench(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 4.3a4.25 4.25 0 0 0-5.6 4.9L4.3 13.8a1.9 1.9 0 0 0 2.7 2.7l4.6-4.6a4.25 4.25 0 0 0 4.9-5.6l-2.5 2.5-2-.4-.4-2 2.5-2.5Z" />
      <path d="M5.3 18.7l.6.6" />
    </svg>
  );
}

export function IconKeyFob(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="3.25" width="10" height="12.5" rx="3" />
      <circle cx="12" cy="7.6" r="1.35" />
      <path d="M9.75 11.5h4.5M9.75 13.5h4.5" />
      <path d="M12 15.75v4.75" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.75l2.35 4.9 5.4.65-3.95 3.75 1 5.35L12 15.85l-4.8 2.55 1-5.35-3.95-3.75 5.4-.65L12 3.75Z" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.75 12.5l4.7 4.7 9.8-10.4" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8.75" y="8.75" width="11.5" height="11.5" rx="2" />
      <path d="M15.25 8.75V5.5A1.75 1.75 0 0 0 13.5 3.75H5.5A1.75 1.75 0 0 0 3.75 5.5v8A1.75 1.75 0 0 0 5.5 15.25H8.75" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.9-5.2M19.5 12a7.5 7.5 0 0 1-12.9 5.2" />
      <path d="M17.7 3.7v3.6h-3.6M6.3 20.3v-3.6h3.6" />
    </svg>
  );
}

export function IconExternalLink(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6H5.75A1.75 1.75 0 0 0 4 7.75v10.5c0 .97.78 1.75 1.75 1.75h10.5A1.75 1.75 0 0 0 18 18.25V15" />
      <path d="M10.5 13.5l9-9M13.5 4.5h6v6" />
    </svg>
  );
}

export function IconAlertCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.1" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSpinner(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.75a8.25 8.25 0 1 0 8.25 8.25" />
    </svg>
  );
}

/** Lookup table used by ExperienceSelector to map category id -> icon. */
export const categoryIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  sales_experience: IconSteeringWheel,
  sales_consultant: IconIdCard,
  staff: IconUsers,
  hospitality: IconCup,
  finance: IconDocumentCheck,
  insurance: IconShieldCheck,
  accessories: IconWrench,
  vehicle_delivery: IconKeyFob,
  overall_experience: IconStar,
};

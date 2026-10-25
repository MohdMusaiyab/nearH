import React from "react";
import Link from "next/link";

export interface LogoProps {
  /**
   * Sizing presets for the mark and typography.
   * - sm: 32px icon, text-lg
   * - md: 40px icon, text-2xl (default)
   * - lg: 48px icon, text-3xl
   * - xl: 64px icon, text-4xl
   */
  size?: "sm" | "md" | "lg" | "xl";
  /** If true, renders only the icon mark without the "NearH" wordmark */
  iconOnly?: boolean;
  /**
   * Color theme variant:
   * - default: Dark Navy "Near" + Vibrant Accent "H" (for light backgrounds)
   * - light: White "Near" + Vibrant Accent "H" (for dark backgrounds)
   * - white: All-white typography (for high-contrast dark surfaces)
   */
  variant?: "default" | "light" | "white";
  /** Optional link destination. If provided, wraps the logo in a Next.js Link */
  href?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    icon: "w-8 h-8 rounded-lg",
    text: "text-lg",
    subtext: "text-[9px] tracking-[0.18em]",
  },
  md: {
    icon: "w-10 h-10 rounded-xl",
    text: "text-2xl",
    subtext: "text-[10px] tracking-[0.2em]",
  },
  lg: {
    icon: "w-12 h-12 rounded-2xl",
    text: "text-3xl",
    subtext: "text-xs tracking-[0.22em]",
  },
  xl: {
    icon: "w-16 h-16 rounded-3xl",
    text: "text-4xl",
    subtext: "text-sm tracking-[0.25em]",
  },
};

/**
 * NearH Proprietary Brand Mark SVG
 * Features the precision 'H' pillar fusion, medical emergency cross, and realtime vital pulse.
 */
export const NearHIconMark = ({
  className = "w-full h-full",
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A5F" />
        <stop offset="50%" stopColor="#0F294A" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>

      <linearGradient id="logoPillar" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0F2FE" />
      </linearGradient>

      <linearGradient id="logoPulse" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>

      <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Squircle Container */}
    <rect width="512" height="512" rx="118" fill="url(#logoBg)" />
    <rect
      x="6"
      y="6"
      width="500"
      height="500"
      rx="112"
      fill="none"
      stroke="#38BDF8"
      strokeOpacity="0.25"
      strokeWidth="4"
    />
    <circle cx="256" cy="256" r="180" fill="url(#logoGlow)" />

    {/* Left Pillar of 'H' */}
    <rect x="116" y="116" width="68" height="280" rx="34" fill="url(#logoPillar)" />

    {/* Right Pillar of 'H' */}
    <rect x="328" y="116" width="68" height="280" rx="34" fill="url(#logoPillar)" />

    {/* Central Medical Cross Horizontal Bar */}
    <rect x="150" y="222" width="212" height="68" rx="34" fill="url(#logoPillar)" />

    {/* Central Medical Cross Vertical Core */}
    <rect x="222" y="150" width="68" height="212" rx="34" fill="url(#logoPillar)" />

    {/* Vital Pulse (ECG Heartbeat) Inset */}
    <path
      d="M150 256 L196 256 L220 200 L256 320 L288 174 L314 256 L362 256"
      fill="none"
      stroke="url(#logoPulse)"
      strokeWidth="24"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Real-time Vital Signal Node */}
    <circle cx="288" cy="174" r="10" fill="#FFFFFF" />
    <circle cx="288" cy="174" r="5" fill="#10B981" />
  </svg>
);

export function Logo({
  size = "md",
  iconOnly = false,
  variant = "default",
  href,
  className = "",
}: LogoProps) {
  const currentSize = sizeConfig[size];

  const primaryTextColor =
    variant === "default"
      ? "text-heading"
      : "text-white";

  const accentTextColor =
    variant === "white"
      ? "text-white"
      : "text-accent";

  const content = (
    <div className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Icon Mark with subtle shadow & hover lift */}
      <div
        className={`${currentSize.icon} overflow-hidden shadow-lg shadow-heading/20 group-hover:scale-105 transition-transform duration-200 shrink-0`}
      >
        <NearHIconMark />
      </div>

      {/* Wordmark Typography */}
      {!iconOnly && (
        <span
          className={`${currentSize.text} font-black tracking-tighter ${primaryTextColor} leading-none`}
        >
          Near
          <span
            className={`${accentTextColor} underline decoration-heading decoration-[3px] underline-offset-4`}
          >
            H
          </span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;

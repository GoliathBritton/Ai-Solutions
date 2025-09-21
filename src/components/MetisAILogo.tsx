"use client";

import React from "react";

type MetisAILogoProps = {
  size?: number;
  animated?: boolean;
  wordmark?: boolean;
  tagline?: string;
  className?: string;
};

/**
 * MetisAI dynamic logo component
 * - Animated gradient stroke "M" glyph with orbiting particle
 * - Optional MetisAI wordmark with animated gradient fill
 */
export default function MetisAILogo({
  size = 64,
  animated = true,
  wordmark = true,
  tagline,
  className,
}: MetisAILogoProps) {
  const svgSize = size;
  const strokeWidth = Math.max(4, Math.round(size / 12));
  const glowClass = animated ? "metisai-logo-glow" : "";
  const orbitClass = animated ? "metisai-orbit" : "";
  const dashClass = animated ? "metisai-dash" : "";

  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 100 100"
        role="img"
        aria-label="MetisAI logo"
        className={glowClass}
      >
        <defs>
          <linearGradient id="metisGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6EE7F9" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Stylized "M" path */}
        <path
          d="M10 85 L30 15 L50 60 L70 15 L90 85"
          fill="none"
          stroke="url(#metisGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={dashClass}
        />

        {/* Orbiting particle path */}
        <g className={orbitClass} style={{ transformOrigin: "50px 50px" }}>
          <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(167,139,250,0.25)" strokeWidth={1.5} />
          <circle cx="86" cy="50" r={Math.max(2.5, strokeWidth / 2.25)} fill="#A78BFA" />
        </g>
      </svg>

      {wordmark && (
        <div style={{ lineHeight: 1 }}>
          <div className="metisai-logo-text" style={{ fontWeight: 800, fontSize: Math.round(size * 0.42) }}>
            MetisAI
          </div>
          {tagline && (
            <div
              style={{
                fontSize: Math.max(10, Math.round(size * 0.18)),
                opacity: 0.85,
                letterSpacing: 0.25,
              }}
            >
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



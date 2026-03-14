import * as React from 'react';

// ── LogoIcon ──────────────────────────────────────────────────────────────────

export interface LogoIconProps extends React.SVGAttributes<SVGElement> {
  /** Icon size (applied to both width and height). Default: 16 */
  size?: number;
  /** Icon color. Default: currentColor — inherits from parent text color */
  color?: string;
}

export function LogoIcon({ size = 16, color = 'currentColor', style, ...props }: LogoIconProps) {
  const height = (size * 16.2069) / 16;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      <g clipPath="url(#logo-icon-clip)">
        <path
          d="M10.0348 0.780437L8.48159 0.364258L7.1727 5.24912L5.99101 0.839034L4.43779 1.25521L5.71453 6.01998L2.53447 2.83994L1.39745 3.97696L4.88558 7.46512L0.541667 6.30116L0.125488 7.85434L4.87176 9.12611C4.81742 8.89173 4.78867 8.64752 4.78867 8.39659C4.78867 6.62044 6.22851 5.1806 8.00465 5.1806C9.7808 5.1806 11.2206 6.62044 11.2206 8.39659C11.2206 8.6459 11.1922 8.88861 11.1386 9.1216L15.4521 10.2774L15.8682 8.72421L11.1031 7.44739L15.4473 6.28335L15.0311 4.73017L10.2661 6.00691L13.4462 2.82688L12.3092 1.68986L8.86943 5.12962L10.0348 0.780437Z"
          fill={color}
        />
        <path
          d="M11.1345 9.13965C11.0014 9.70263 10.7202 10.2084 10.3345 10.6136L13.4594 13.7386L14.5964 12.6015L11.1345 9.13965Z"
          fill={color}
        />
        <path
          d="M10.3032 10.6465C9.91284 11.0452 9.41948 11.3428 8.86621 11.4961L10.0033 15.7398L11.5565 15.3236L10.3032 10.6465Z"
          fill={color}
        />
        <path
          d="M8.80722 11.5117C8.55053 11.5777 8.28148 11.6127 8.00421 11.6127C7.70716 11.6127 7.41951 11.5725 7.14643 11.4971L6.0083 15.7446L7.56148 16.1608L8.80722 11.5117Z"
          fill={color}
        />
        <path
          d="M7.09231 11.4818C6.54749 11.3209 6.0629 11.0195 5.68046 10.6196L2.54785 13.7522L3.68487 14.8893L7.09231 11.4818Z"
          fill={color}
        />
        <path
          d="M5.65442 10.5915C5.27855 10.189 5.00476 9.69004 4.87444 9.13574L0.546875 10.2953L0.963051 11.8485L5.65442 10.5915Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="logo-icon-clip">
          <rect width="16" height="16.2069" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

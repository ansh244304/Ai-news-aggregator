/**
 * NEWSMANIA logo: the brand tile with the white "N" glyph.
 * Drawn as a stroke path so it stays sharp at any size and needs no
 * binary asset.
 */
export default function Logo({ size = 36, className = "", radius = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Newsmania"
      className={`shrink-0 text-primary ${className}`}
    >
      <rect width="64" height="64" rx={radius} fill="currentColor" />

      <path
        d="M20 50V14L44 50V14"
        stroke="#FFFFFF"
        strokeWidth="12"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

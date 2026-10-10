export default function CategoryTag({ children, className = "" }) {
  return (
    <span
      className={`text-xs font-bold uppercase tracking-wide text-primary ${className}`}
    >
      {children}
    </span>
  );
}

export default function Label({ htmlFor, children, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted ${className}`}
    >
      {children}
    </label>
  );
}

export default function Card({ className = "", children, ...rest }) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-line bg-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

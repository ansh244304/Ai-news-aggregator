import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { error = false, id, className = "", ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={error || undefined}
      className={`h-11 w-full rounded-[10px] border bg-bg px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/25 ${
        error ? "border-danger" : "border-line"
      } ${className}`}
      {...rest}
    />
  );
});

export default Input;

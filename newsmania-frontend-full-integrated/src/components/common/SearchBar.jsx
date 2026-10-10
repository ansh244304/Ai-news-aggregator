import { Search } from "lucide-react";
import Input from "../ui/Input";

export default function SearchBar({
  value = "",
  onChange = () => {},
  onSubmit,
  placeholder = "Search current affairs..."
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
      className="relative w-full"
      role="search"
    >
      <Search
        size={17}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />

      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-10"
      />
    </form>
  );
}

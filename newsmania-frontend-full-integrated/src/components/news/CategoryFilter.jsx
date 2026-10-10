import Chip from "../ui/Chip";

export const CATEGORIES = [
  { key: "", label: "All" },
  { key: "National", label: "National" },
  { key: "International", label: "International" },
  { key: "Economy", label: "Economy" },
  { key: "Science", label: "Science" },
  { key: "Technology", label: "Technology" },
  { key: "Environment", label: "Environment" },
  { key: "Defence", label: "Defence" },
  { key: "Sports", label: "Sports" },
  { key: "Polity", label: "Polity" }
];

export default function CategoryFilter({
  categories = CATEGORIES,
  value = "",
  onChange = () => {}
}) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-1 flex flex-wrap gap-2"
    >
      {categories.map((category) => {
        const active = category.key === value;

        return (
          <Chip
            key={category.key || "all"}
            selected={active}
            onClick={() => onChange(category.key)}
          >
            {category.label}
          </Chip>
        );
      })}
    </div>
  );
}

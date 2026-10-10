import Panel from "./Panel";

export default function StatCard({ icon, value = "0", label = "Total", hint }) {
  return (
    <Panel className="flex flex-col gap-2">
      {icon && (
        <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-primary-soft text-primary">
          {icon}
        </span>
      )}

      <div className="font-display text-3xl font-bold leading-none tracking-tight text-ink">
        {value}
      </div>

      <div className="text-xs font-semibold text-muted">{label}</div>

      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </Panel>
  );
}

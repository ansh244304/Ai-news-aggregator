import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../components/common/Logo";

const ADMIN_LINKS = [
  ["/admin", "Dashboard"],
  ["/admin/news", "News"],
  ["/admin/mcq", "MCQs"],
  ["/admin/daily-quiz", "Daily Quiz"]
];

const linkClass = ({ isActive }) =>
  `block rounded-[10px] px-3 py-2.5 text-sm font-semibold transition duration-150 ${
    isActive
      ? "bg-primary text-primary-fg"
      : "text-muted hover:bg-primary-soft hover:text-primary"
  }`;

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-card px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition hover:bg-primary-soft hover:text-primary lg:hidden"
          aria-label="Open admin menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <Logo size={32} />

          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            NEWSMANIA
          </span>

          <span className="rounded-[6px] bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold tracking-[0.08em] text-primary">
            ADMIN
          </span>
        </div>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {ADMIN_LINKS.map(([to, label]) => (
            <a key={to} href={to} className={linkClass({ isActive: false })}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col border-l border-line bg-card transition-transform duration-200 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Admin Panel
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition hover:bg-primary-soft hover:text-primary"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {ADMIN_LINKS.map(([to, label]) => (
            <a
              key={to}
              href={to}
              onClick={() => setMenuOpen(false)}
              className={linkClass({ isActive: false })}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

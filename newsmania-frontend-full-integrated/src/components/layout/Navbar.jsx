import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Search,
  Shield,
  Sun,
  Sunrise,
  Trophy,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/briefing", label: "Daily Briefing", icon: Sunrise },
  { to: "/news", label: "Current Affairs", icon: Newspaper },
  { to: "/daily-quiz", label: "Daily Quiz", icon: Trophy },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
];

/* ================= SHARED CLASS STRINGS ================= */

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E8] dark:focus-visible:ring-[#7F98FF]";

const outline =
  "border border-[#E3E5EC] text-[#12141C] hover:border-[#2347E8] hover:text-[#2347E8] dark:border-[#2A2F3F] dark:text-[#F1F2F6] dark:hover:border-[#7F98FF] dark:hover:text-[#7F98FF]";

const button =
  "inline-flex h-11 items-center justify-center rounded-[10px] px-4 text-sm font-semibold transition duration-150";

const iconButton = `h-11 w-11 place-items-center rounded-[10px] transition duration-150 ${outline} ${focus}`;

const primaryButton = `inline-flex h-11 items-center justify-center rounded-[10px] bg-[#2347E8] px-4 text-sm font-semibold text-white transition duration-150 hover:bg-[#1B38C0] dark:bg-[#7F98FF] dark:text-[#0E1018] dark:hover:bg-[#9DB0FF] ${focus}`;

const linkClass = ({ isActive }) =>
  `flex h-11 items-center whitespace-nowrap px-3 text-[15px] font-semibold transition duration-150 ${focus} ${
    isActive
      ? "text-[#2347E8] shadow-[inset_0_-3px_0_#2347E8] dark:text-[#7F98FF] dark:shadow-[inset_0_-3px_0_#7F98FF]"
      : "text-[#12141C] hover:text-[#2347E8] dark:text-[#F1F2F6] dark:hover:text-[#7F98FF]"
  }`;

const drawerLinkClass = ({ isActive }) =>
  `flex h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] font-semibold transition duration-150 ${focus} ${
    isActive
      ? "bg-[#E8EDFF] text-[#2347E8] dark:bg-[#232A4A] dark:text-[#7F98FF]"
      : "text-[#12141C] hover:bg-[#F6F7FA] dark:text-[#F1F2F6] dark:hover:bg-[#0E1018]"
  }`;

/* ================= SMALL COMPONENTS ================= */

function Wordmark({ size = 26 }) {
  return (
    <span
      style={{ fontSize: `${size}px` }}
      className="font-['Bricolage_Grotesque',_'DM_Sans',_Arial,sans-serif] font-extrabold leading-none tracking-tight text-[#12141C] dark:text-[#F1F2F6]"
    >
      NEWS
      <span className="text-[#2347E8] dark:text-[#7F98FF]">MANIA</span>
    </span>
  );
}

function SearchBox({ className = "", onDone }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const value = term.trim();

    onDone?.();
    navigate(value ? `/news?q=${encodeURIComponent(value)}` : "/news");
  };

  return (
    <form role="search" onSubmit={submit} className={className}>
      <div className="relative w-full">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#454B5E] dark:text-[#A9AFC2]"
        />

        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search news, topics, keywords"
          aria-label="Search news"
          className={`h-11 w-full rounded-full border border-[#E3E5EC] bg-[#F6F7FA] pl-10 pr-4 text-[15px] text-[#12141C] placeholder:text-[#454B5E] dark:border-[#2A2F3F] dark:bg-[#0E1018] dark:text-[#F1F2F6] dark:placeholder:text-[#A9AFC2] ${focus}`}
        />
      </div>
    </form>
  );
}

/* ================= NAVBAR ================= */

export default function Navbar({ menuOpen = false, onOpenMenu, onCloseMenu }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") onCloseMenu?.();
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, onCloseMenu]);

  const signOut = () => {
    onCloseMenu?.();
    logout();
    navigate("/login");
  };

  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className={`grid ${iconButton}`}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  return (
    <>
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-[#E3E5EC] bg-white dark:border-[#2A2F3F] dark:bg-[#171A24]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onOpenMenu}
            className={`grid xl:hidden ${iconButton}`}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <Link
            to="/"
            aria-label="NEWSMANIA home"
            className="flex h-11 items-center"
          >
            <Wordmark size={26} />
          </Link>

          <nav aria-label="Main" className="hidden items-center xl:flex">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <SearchBox
            className="hidden max-w-sm flex-1 md:block"
            onDone={onCloseMenu}
          />

          <div className="ml-auto flex items-center gap-x-2">
            {themeToggle}

            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`hidden sm:grid ${iconButton}`}
                    aria-label="Admin panel"
                  >
                    <Shield size={18} />
                  </Link>
                )}

                <Link
                  to="/profile"
                  aria-label={`Profile: ${user?.name || "Profile"}`}
                  className={`grid h-11 w-11 place-items-center rounded-full bg-[#E8EDFF] text-sm font-bold uppercase text-[#2347E8] transition duration-150 hover:brightness-95 dark:bg-[#232A4A] dark:text-[#7F98FF] ${focus}`}
                >
                  {initial}
                </Link>

                <button
                  type="button"
                  onClick={signOut}
                  className={`hidden sm:grid ${iconButton}`}
                  aria-label="Log out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${button} ${outline} hidden sm:inline-flex ${focus}`}
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className={`${primaryButton} hidden sm:inline-flex`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE / TABLET DRAWER ================= */}

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 xl:hidden"
          onClick={onCloseMenu}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col border-l border-[#E3E5EC] bg-white shadow-2xl transition-[transform,visibility] duration-200 dark:border-[#2A2F3F] dark:bg-[#171A24] xl:hidden ${
          menuOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E3E5EC] px-4 py-3 dark:border-[#2A2F3F]">
          <Wordmark size={20} />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onCloseMenu}
            className={`grid ${iconButton}`}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-[#E3E5EC] p-3 dark:border-[#2A2F3F]">
          <SearchBox className="w-full" onDone={onCloseMenu} />
        </div>

        <nav
          aria-label="Mobile"
          className="flex-1 space-y-1 overflow-y-auto p-3"
        >
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMenu}
                className={drawerLinkClass}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {isAuthenticated && (
            <NavLink
              to="/profile"
              onClick={onCloseMenu}
              className={`${drawerLinkClass({ isActive: false })} sm:hidden`}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E8EDFF] text-xs font-bold uppercase text-[#2347E8] dark:bg-[#232A4A] dark:text-[#7F98FF]">
                {initial}
              </span>
              <span>Profile</span>
            </NavLink>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={onCloseMenu}
              className={`${drawerLinkClass({ isActive: false })} sm:hidden`}
            >
              <Shield size={18} />
              <span>Admin panel</span>
            </NavLink>
          )}
        </nav>

        <div className="border-t border-[#E3E5EC] p-4 dark:border-[#2A2F3F]">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={signOut}
              className={`${button} ${outline} w-full sm:hidden`}
            >
              <LogOut size={16} />
              <span className="ml-2">Log out</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={onCloseMenu}
                className={`${button} ${outline} ${focus}`}
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={onCloseMenu}
                className={primaryButton}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

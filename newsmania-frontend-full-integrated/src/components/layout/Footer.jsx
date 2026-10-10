import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Logo from "../common/Logo";

const SOCIAL_LINKS = [
  ["Twitter", Twitter, "https://twitter.com"],
  ["Facebook", Facebook, "https://facebook.com"],
  ["Instagram", Instagram, "https://instagram.com"],
  ["YouTube", Youtube, "https://youtube.com"],
  ["LinkedIn", Linkedin, "https://linkedin.com"]
];

const footerLink =
  "inline-flex min-h-11 items-center text-xs font-semibold text-muted transition duration-150 hover:text-primary";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col gap-7 py-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={38} />

            <div>
              <p className="font-display text-base font-extrabold tracking-tight text-ink">
                NEWSMANIA
              </p>

              <p className="mt-0.5 text-xs text-muted">
                Current affairs. Smarter preparation.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-semibold text-muted">
            <Link to="/briefing" className={footerLink}>
              Daily Briefing
            </Link>

            <Link to="/news" className={footerLink}>
              Current Affairs
            </Link>

            <Link to="/daily-quiz" className={footerLink}>
              Daily Quiz
            </Link>

            <Link to="/dashboard" className={footerLink}>
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map(([label, Icon, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition duration-150 hover:bg-primary-soft hover:text-primary"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>&copy; 2026 Newsmania</span>

          <span>
            Built for aspirants. All news links back to the source.
          </span>
        </div>
      </div>
    </footer>
  );
}

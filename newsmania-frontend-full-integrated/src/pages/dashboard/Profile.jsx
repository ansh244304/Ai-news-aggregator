import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  KeyRound,
  Loader2,
  Mail,
  Shield,
  Target,
  Trophy,
  User
} from "lucide-react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import StreakCard from "../../components/dashboard/StreakCard";
import { getFirstName, getGreeting } from "../../utils/format";

const initials = (name = "") =>
  (name || "")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const EMPTY_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  revealed,
  onToggleReveal,
  hint,
  invalid
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={revealed ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-[10px] border bg-bg pl-3 pr-11 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/25 ${
            invalid ? "border-danger" : "border-line"
          }`}
        />

        <button
          type="button"
          onClick={onToggleReveal}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition hover:text-primary"
          aria-label={revealed ? `Hide ${label}` : `Show ${label}`}
        >
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function ChangePasswordCard() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [revealed, setRevealed] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const setField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setDone(false);
  };

  const toggleReveal = (field) =>
    setRevealed((current) => ({
      ...current,
      [field]: !current[field]
    }));

  const submit = async (event) => {
    event.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      setForm(EMPTY_FORM);
      setRevealed({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });
      setDone(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not change your password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-primary-soft text-primary">
          <KeyRound size={17} />
        </span>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted">
            Security
          </h2>

          <h3 className="font-display text-base font-bold text-ink">
            Change Password
          </h3>
        </div>
      </div>

      {done && (
        <p className="mt-4 flex items-center gap-2 rounded-[14px] border border-success/40 bg-success/10 px-3.5 py-2.5 text-sm font-semibold text-success">
          <CheckCircle2 size={16} className="shrink-0" />
          Password changed. Use it the next time you sign in.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[14px] border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      <form onSubmit={submit} className="mt-4 space-y-4">
        <PasswordField
          id="currentPassword"
          label="Current Password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={setField("currentPassword")}
          revealed={revealed.currentPassword}
          onToggleReveal={() => toggleReveal("currentPassword")}
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={setField("newPassword")}
          revealed={revealed.newPassword}
          onToggleReveal={() => toggleReveal("newPassword")}
          hint="At least 6 characters, and different from your current one."
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={setField("confirmPassword")}
          revealed={revealed.confirmPassword}
          onToggleReveal={() => toggleReveal("confirmPassword")}
          invalid={
            Boolean(form.confirmPassword) &&
            form.confirmPassword !== form.newPassword
          }
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}

export default function Profile() {
  const { user } = useAuth();

  const [streak, setStreak] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStreak = useCallback(async () => {
    setRefreshing(true);

    try {
      const { data } = await api.get("/briefing/today");
      setStreak(data.data?.streak || null);
    } catch {
      setStreak(null);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  const displayName = user?.name || "Learner";
  const badges = streak?.badges || [];

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* ================= IDENTITY ================= */}

        <section className="overflow-hidden rounded-2xl border border-line bg-card">
          <div className="h-24 bg-hero sm:h-28" />

          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border-4 border-card bg-primary font-display text-2xl font-extrabold text-primary-fg sm:h-28 sm:w-28 sm:text-3xl">
                  {initials(displayName)}
                </div>

                <div className="pb-1">
                  <h1 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                    {displayName}
                  </h1>

                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                    <Mail size={14} />
                    {user?.email}
                  </p>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold capitalize text-primary sm:self-auto">
                <Shield size={13} />
                {user?.role || "user"}
              </span>
            </div>

            <p className="mt-4 text-sm text-muted">
              {getGreeting()}, {getFirstName(displayName)}. Your study
              progress, streak and badges live here.
            </p>
          </div>
        </section>

        {/* ================= STREAK ================= */}

        <div className="mt-4">
          <StreakCard streak={streak} />
        </div>

        {/* ================= DETAILS ================= */}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted">
              Account
            </h2>

            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3">
                <User size={16} className="text-primary" />
                <span className="text-sm text-ink">{displayName}</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <span className="truncate text-sm text-ink">
                  {user?.email}
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Shield size={16} className="text-primary" />
                <span className="text-sm capitalize text-ink">
                  {user?.role || "user"}
                </span>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted">
              Badges Earned
            </h2>

            {badges.length ? (
              <ul className="mt-4 space-y-2.5">
                {badges.map((badge) => (
                  <li
                    key={badge.id}
                    className="flex items-center gap-3 rounded-[14px] border border-streak/40 bg-streak/10 p-3"
                  >
                    <Trophy size={18} className="shrink-0 text-streak" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-streak">
                        {badge.name}
                      </p>
                      <p className="text-xs text-muted">
                        {badge.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                No badges yet. Play the daily quiz to start earning them.
              </p>
            )}
          </section>
        </div>

        {/* ================= CHANGE PASSWORD ================= */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChangePasswordCard />

          <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted">
              Account Security
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-ink">
              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-success"
                />
                Passwords are hashed with bcrypt before storage.
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-success"
                />
                Your current password is verified before the change is
                written.
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-success"
                />
                Signed in sessions last one hour. Re-login after a change
                if you are asked.
              </li>
            </ul>

            <Link
              to="/forgot-password"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition duration-150 hover:underline"
            >
              Forgot your password?
            </Link>
          </section>
        </div>

        {/* ================= SHORTCUTS ================= */}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {[
            {
              to: "/dashboard",
              icon: <Target size={18} />,
              label: "Dashboard",
              value: "Your progress"
            },
            {
              to: "/daily-quiz",
              icon: <Brain size={18} />,
              label: "Daily Quiz",
              value: "Play today"
            },
            {
              to: "/bookmarks",
              icon: <Bookmark size={18} />,
              label: "Bookmarks",
              value: "Saved articles"
            },
            {
              to: "/briefing",
              icon: <Flame size={18} />,
              label: "Briefing",
              value: "Today's stories"
            }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-2xl border border-line bg-card p-4 transition duration-150 hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-primary-soft text-primary transition duration-150 group-hover:bg-primary group-hover:text-primary-fg">
                {item.icon}
              </span>

              <p className="mt-3 text-sm font-bold text-ink">
                {item.label}
              </p>

              <p className="text-xs text-muted">{item.value}</p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={loadStreak}
          disabled={refreshing}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-line text-sm font-semibold text-muted transition duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing && <Loader2 size={14} className="animate-spin" />}
          {refreshing ? "Refreshing..." : "Refresh my streak"}
        </button>
      </div>
    </div>
  );
}

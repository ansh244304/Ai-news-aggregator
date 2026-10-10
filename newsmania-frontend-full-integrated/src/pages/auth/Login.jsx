import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import GoogleButton from "../../components/auth/GoogleButton";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";

export default function Login() {
  const { login, googleLogin, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ email: "", password: "" });
  const [e, setE] = useState("");

  const land = (data) => {
    const u = data?.data?.user || data?.user;

    nav(
      u?.role === "admin"
        ? "/admin"
        : loc.state?.from?.pathname || "/dashboard"
    );
  };

  const submit = async (x) => {
    x.preventDefault();
    setE("");

    try {
      land(await login(f.email, f.password));
    } catch (err) {
      setE(err.response?.data?.message || "Login failed");
    }
  };

  const onGoogle = async (credential) => {
    setE("");

    if (!credential) {
      return setE("Google did not return a credential");
    }

    try {
      land(await googleLogin(credential));
    } catch (err) {
      setE(err.response?.data?.message || "Google sign in failed");
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-card lg:grid-cols-2">
        <div className="hidden flex-col justify-center gap-4 bg-hero p-10 lg:flex">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">
              NEWSMANIA
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Prepare with clarity.
          </h1>

          <p className="text-white/70">
            Turn daily news into exam-ready knowledge.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Welcome back
          </span>

          <h2 className="mt-1.5 font-display text-2xl font-bold text-ink">
            Sign in
          </h2>

          {e && (
            <p
              role="alert"
              className="mt-4 rounded-[14px] border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger"
            >
              {e}
            </p>
          )}

          <div className="mt-5">
            <GoogleButton
              onCredential={onGoogle}
              onError={(err) => setE(err.message)}
            />
          </div>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-muted">
            <span className="h-px flex-1 bg-line" />
            or sign in with email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
                Email
              </span>
              <Input
                required
                type="email"
                value={f.email}
                onChange={(x) => setF({ ...f, email: x.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
                Password
              </span>
              <Input
                required
                type="password"
                value={f.password}
                onChange={(x) => setF({ ...f, password: x.target.value })}
              />
            </label>

            <Link
              to="/forgot-password"
              className="inline-block text-sm font-semibold text-primary transition duration-150 hover:underline"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-primary transition duration-150 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

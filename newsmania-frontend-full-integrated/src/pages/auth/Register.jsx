import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import GoogleButton from "../../components/auth/GoogleButton";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";

const CODE_LENGTH = 6;

export default function Register() {
  const { register, verifyEmail, resendVerification, googleLogin, loading } =
    useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState("form");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [c, setC] = useState("");
  const [code, setCode] = useState("");
  const [e, setE] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const codeRef = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((n) => n - 1), 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const startCooldown = (seconds) => setCooldown(seconds || 60);

  const land = (data) => {
    const u = data?.data?.user || data?.user;

    nav(u?.role === "admin" ? "/admin" : "/dashboard");
  };

  const submit = async (x) => {
    x.preventDefault();
    setE("");

    if (f.password !== c) {
      return setE("Passwords do not match");
    }

    try {
      const data = await register(f.name, f.email, f.password);

      setStep("verify");
      setCode("");
      setNotice(`We sent a ${CODE_LENGTH} character code to ${f.email}`);
      startCooldown(data?.resendAvailableIn);
    } catch (err) {
      setE(err.response?.data?.message || "Registration failed");
    }
  };

  const submitCode = async (x) => {
    x.preventDefault();
    setE("");

    if (code.length !== CODE_LENGTH) {
      return setE("Enter the full code from the email");
    }

    try {
      const data = await verifyEmail(f.email, code);

      land(data);
    } catch (err) {
      setE(err.response?.data?.message || "Verification failed");
    }
  };

  const resend = async () => {
    setE("");
    setNotice("");

    try {
      const data = await resendVerification(f.email);

      setNotice(`We sent a new code to ${f.email}`);
      startCooldown(data?.resendAvailableIn);
    } catch (err) {
      setE(err.response?.data?.message || "Could not resend the code");
    }
  };

  const onGoogle = async (credential) => {
    setE("");

    if (!credential) {
      return setE("Google did not return a credential");
    }

    try {
      const data = await googleLogin(credential);

      land(data);
    } catch (err) {
      setE(err.response?.data?.message || "Google sign in failed");
    }
  };

  const onCodeChange = (index, value) => {
    const digit = value.replace(/[^a-z0-9]/gi, "").slice(-1);

    if (!digit) return;

    const next = [...code.padEnd(CODE_LENGTH, " ")];
    next[index] = digit;

    setCode(next.join("").trimEnd());
    setE("");

    if (index < CODE_LENGTH - 1) {
      codeRef.current[index + 1]?.focus();
    }
  };

  const onCodeKeyDown = (index, x) => {
    if (x.key === "Backspace" && !code[index]) {
      codeRef.current[index - 1]?.focus();
    }

    if (x.key === "ArrowLeft") {
      codeRef.current[index - 1]?.focus();
    }

    if (x.key === "ArrowRight") {
      codeRef.current[index + 1]?.focus();
    }
  };

  const onCodePaste = (x) => {
    const pasted = x.clipboardData
      .getData("text")
      .replace(/[^a-z0-9]/gi, "")
      .slice(0, CODE_LENGTH)
      .toUpperCase();

    if (!pasted) return;

    x.preventDefault();
    setCode(pasted);
    codeRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const brand = (
    <div className="hidden flex-col justify-center gap-4 bg-hero p-10 lg:flex">
      <div className="flex items-center gap-3">
        <Logo size={44} />
        <span className="font-display text-2xl font-extrabold tracking-tight text-white">
          NEWSMANIA
        </span>
      </div>

      <h1 className="mt-2 font-display text-3xl font-bold text-white">
        Build your daily edge.
      </h1>

      <p className="text-white/70">Read smarter. Practice better.</p>
    </div>
  );

  const fieldLabel =
    "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted";

  if (step === "verify") {
    return (
      <div className="px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-card lg:grid-cols-2">
          {brand}

          <div className="p-6 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              One last step
            </span>

            <h2 className="mt-1.5 font-display text-2xl font-bold text-ink">
              Verify your email
            </h2>

            <p className="mt-2 text-sm text-muted">
              {notice ||
                `We sent a ${CODE_LENGTH} character code to ${f.email}`}
            </p>

            {e && (
              <p
                role="alert"
                className="mt-4 rounded-[14px] border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger"
              >
                {e}
              </p>
            )}

            <form className="mt-5 space-y-4" onSubmit={submitCode}>
              <div>
                <span className={fieldLabel}>Verification code</span>

                <div className="flex gap-2">
                  {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                    <input
                      key={i}
                      ref={(node) => {
                        codeRef.current[i] = node;
                      }}
                      inputMode="text"
                      autoComplete="one-time-code"
                      maxLength={1}
                      aria-label={`Digit ${i + 1}`}
                      value={code[i] || ""}
                      onChange={(x) => onCodeChange(i, x.target.value)}
                      onKeyDown={(x) => onCodeKeyDown(i, x)}
                      onPaste={onCodePaste}
                      autoFocus={i === 0}
                      className="h-12 w-full min-w-0 rounded-[10px] border border-line bg-bg text-center text-lg font-bold text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== CODE_LENGTH}
                className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify and continue"}
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resend}
                disabled={cooldown > 0 || loading}
                className="inline-flex h-11 items-center rounded-[10px] border border-line px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setE("");
                  setNotice("");
                }}
                disabled={loading}
                className="inline-flex h-11 items-center rounded-[10px] border border-line px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Use a different email
              </button>
            </div>

            <p className="mt-5 text-sm text-muted">
              Already verified?{" "}
              <Link
                to="/login"
                className="font-bold text-primary transition duration-150 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-card lg:grid-cols-2">
        {brand}

        <div className="p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Get started
          </span>

          <h2 className="mt-1.5 font-display text-2xl font-bold text-ink">
            Create account
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
            or sign up with email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className={fieldLabel}>Name</span>
              <Input
                required
                value={f.name}
                onChange={(x) => setF({ ...f, name: x.target.value })}
              />
            </label>

            <label className="block">
              <span className={fieldLabel}>Email</span>
              <Input
                required
                type="email"
                value={f.email}
                onChange={(x) => setF({ ...f, email: x.target.value })}
              />
            </label>

            <label className="block">
              <span className={fieldLabel}>Password</span>
              <Input
                required
                type="password"
                value={f.password}
                onChange={(x) => setF({ ...f, password: x.target.value })}
              />
            </label>

            <label className="block">
              <span className={fieldLabel}>Confirm Password</span>
              <Input
                required
                type="password"
                value={c}
                onChange={(x) => setC(x.target.value)}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary transition duration-150 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

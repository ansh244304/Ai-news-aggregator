import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import Logo from "../../components/common/Logo";
import Input from "../../components/ui/Input";

export default function ForgotPassword() {
  const [e, setE] = useState("");
  const [m, setM] = useState("");

  const submit = async (x) => {
    x.preventDefault();

    try {
      const { data } = await api.post("/auth/forgot-password", { email: e });
      setM(data.message || "Reset instructions sent");
    } catch (x2) {
      setM(x2.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <Logo size={40} />
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            NEWSMANIA
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold text-ink">
          Forgot password?
        </h2>

        <p className="mt-1.5 text-sm text-muted">
          Enter your email and we&apos;ll send reset instructions.
        </p>

        <form className="mt-5 space-y-4" onSubmit={submit}>
          <Input
            required
            type="email"
            value={e}
            onChange={(x) => setE(x.target.value)}
            placeholder="Email"
            aria-label="Email"
          />

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Send Reset Link
          </button>
        </form>

        {m && <p className="mt-3 text-sm text-muted">{m}</p>}

        <Link
          className="mt-4 inline-block text-sm font-bold text-primary transition duration-150 hover:underline"
          to="/login"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise = null;

// The GSI script can fire its load event before window.google.accounts
// is populated, so waiting on load alone is not enough. Polling for the
// id namespace is the only reliable signal that the API is usable.
const whenGoogleReady = (timeout = 10000) =>
  new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      if (window.google?.accounts?.id) {
        resolve(window.google);
        return;
      }

      if (Date.now() - startedAt > timeout) {
        reject(new Error("Google sign in did not initialise"));
        return;
      }

      setTimeout(check, 50);
    };

    check();
  });

// Google ships one script for everyone, so it is loaded at most
// once and shared by every button on the page.
const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[src="${SCRIPT_SRC}"]`
      );

      if (existing) {
        existing.addEventListener("error", () =>
          reject(new Error("Could not reach Google"))
        );
      } else {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("error", () =>
          reject(new Error("Could not reach Google"))
        );
        document.head.appendChild(script);
      }

      whenGoogleReady().then(resolve, reject);
    });
  }

  return scriptPromise;
};

/**
 * Official "Sign in with Google" button.
 *
 * Renders Google's own button rather than a lookalike, because the
 * branding rules require it. The popup answers with a credential
 * that the backend verifies, so nothing here is trusted.
 */
export default function GoogleButton({ onCredential, onError, text = "continue_with" }) {
  const holder = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID) return;

    let disposed = false;

    loadGoogleScript()
      .then((google) => {
        if (disposed) return;

        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) =>
            callbackRef.current?.(response?.credential),
          ux_mode: "popup",
          // The account chooser should not re-prompt for an account
          // that already granted access on a previous visit
          auto_prompt: false
        });

        setReady(true);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
    };
  }, []);

  // Google wants a pixel width and does not reflow on its own, so
  // the button is redrawn whenever the card changes size.
  useEffect(() => {
    if (!ready || !holder.current) return;

    const node = holder.current;
    let width = 0;
    let observer = null;

    const draw = () => {
      if (!holder.current) return;

      width = node.clientWidth;

      window.google.accounts.id.renderButton(node, {
        type: "standard",
        theme: document.documentElement.classList.contains("dark")
          ? "filled_black"
          : "outline",
        size: "large",
        text,
        shape: "rectangular",
        logo_alignment: "left",
        width: Math.max(width, 120)
      });
    };

    draw();

    observer = new ResizeObserver(draw);
    observer.observe(node);

    return () => observer?.disconnect();
  }, [ready, text]);

  // The theme lives on the document element, so the redraw has to be
  // kicked off manually when it flips.
  useEffect(() => {
    if (!ready) return;

    const observer = new MutationObserver(() => {
      const node = holder.current;

      if (!node) return;

      window.google.accounts.id.renderButton(node, {
        type: "standard",
        theme: document.documentElement.classList.contains("dark")
          ? "filled_black"
          : "outline",
        size: "large",
        text,
        shape: "rectangular",
        logo_alignment: "left",
        width: Math.max(node.clientWidth, 120)
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, [ready, text]);

  // No client id configured. The option still renders, otherwise
  // the register page silently loses the feature and looks broken.
  // It explains what is missing when pressed.
  if (!CLIENT_ID) {
    return (
      <div className="grid gap-2 text-center">
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-card text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
          onClick={() =>
            onError?.(
              new Error(
                "Google sign in needs VITE_GOOGLE_CLIENT_ID in the frontend .env and GOOGLE_CLIENT_ID in the backend .env"
              )
            )
          }
        >
          <GoogleMark />
          Continue with Google
        </button>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="grid gap-2 text-center">
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-card text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
          onClick={() =>
            onError?.(new Error("Google sign in is unavailable right now"))
          }
        >
          <GoogleMark />
          Continue with Google
        </button>
        <small className="text-xs text-muted">
          Google could not be reached. Try again.
        </small>
      </div>
    );
  }

  return (
    <div
      ref={holder}
      className={`flex min-h-[44px] w-full justify-center ${
        ready ? "" : "rounded-[10px] border border-line bg-bg"
      }`}
      aria-hidden={!ready}
    />
  );
}

/** Google's four colour mark, used only by the unconfigured fallback. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A22 22 0 002 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

export const googleEnabled = Boolean(CLIENT_ID);

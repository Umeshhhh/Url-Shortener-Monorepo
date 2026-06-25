import axios from "axios";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import "../App.css";
import { API_BASE_URL } from "../api/config";

type RedirectStatus = "loading" | "protected" | "not-found" | "error";

const statusContent: Record<Exclude<RedirectStatus, "loading" | "protected">, {
  eyebrow: string;
  title: string;
  description: string;
}> = {
  "not-found": {
    eyebrow: "404",
    title: "This short link does not exist.",
    description: "It may have been removed, mistyped, or never created. Check the code and try again.",
  },
  error: {
    eyebrow: "Redirect unavailable",
    title: "We could not open this link.",
    description: "The redirect service did not respond as expected. Wait a moment and try again.",
  },
};

const RedirectingPage = () => {
  const { shortCode } = useParams();
  const [status, setStatus] = useState<RedirectStatus>("loading");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode || shortCode === "undefined") {
        setStatus("not-found");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/resolve/${shortCode}`);
        const originalUrl = response.data?.originalUrl;

        if (!originalUrl) {
          setStatus("not-found");
          return;
        }

        window.location.replace(originalUrl);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setStatus("not-found");
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 401 && error.response.data?.isProtected) {
          setStatus("protected");
          return;
        }

        setStatus("error");
      }
    };

    handleRedirect();
  }, [shortCode]);

  const handleProtectedAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!shortCode || shortCode === "undefined") {
      setStatus("not-found");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Enter the password to open this link.");
      return;
    }

    setIsSubmitting(true);
    setPasswordError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/${shortCode}/access`, {
        urlPassword: password,
      });
      const originalUrl = response.data?.originalUrl;

      if (!originalUrl) {
        setStatus("not-found");
        return;
      }

      window.location.replace(originalUrl);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setPasswordError("That password does not match this link.");
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setStatus("not-found");
        return;
      }

      setPasswordError("We could not unlock this link. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (password) {
      setPasswordError("");
    }
  }, [password]);

  const content = status === "loading" || status === "protected" ? null : statusContent[status];

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#07101d] px-4 py-8 text-[#eef6ff] sm:px-5 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:86px_86px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,214,190,0.28),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(197,77,255,0.24),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(5,9,18,0.65)_100%)]" />

      <section className="relative z-10 w-full max-w-[620px] animate-[fadeUp_650ms_ease-out_both] rounded-[24px] border border-white/10 bg-[#08101e]/75 p-5 text-center shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:rounded-[32px] sm:p-10">
        <Link className="mx-auto mb-8 flex w-fit items-center gap-3 text-xl font-extrabold text-white" to="/">
          <span className="grid size-10 place-items-center rounded-full bg-[#05dac1] text-[#02181d]">
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
              <path d="M10 8H7a4 4 0 0 0 0 8h3" />
              <path d="M14 8h3a4 4 0 0 1 0 8h-3" />
              <path d="M8 12h8" />
            </svg>
          </span>
          snip
        </Link>

        {status === "loading" ? (
          <>
            <div className="mx-auto grid size-16 place-items-center rounded-full border border-[#04e1c0]/35 bg-[#04e1c0]/10">
              <div className="size-8 animate-spin rounded-full border-2 border-[#04e1c0] border-r-transparent" />
            </div>
            <h1 className="mt-7 text-3xl font-black leading-tight text-white sm:text-5xl">Opening your link...</h1>
            <p className="mx-auto mt-4 max-w-[430px] text-base font-medium leading-relaxed text-[#a7b0c5] sm:text-lg">
              Hold tight while Snip finds the destination and sends you there.
            </p>
          </>
        ) : status === "protected" ? (
          <>
            <div className="mx-auto grid size-16 place-items-center rounded-full border border-[#cf69ff]/35 bg-[#cf69ff]/10 text-[#e6b7ff] shadow-[0_0_42px_rgba(207,105,255,0.18)]">
              <svg className="size-7" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
                <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                <path d="M6 11h12v9H6z" />
              </svg>
            </div>
            <h1 className="mt-7 text-3xl font-black leading-tight text-white sm:text-5xl">This link is protected.</h1>
            <p className="mx-auto mt-4 max-w-[470px] text-base font-medium leading-relaxed text-[#a7b0c5] sm:text-lg">
              Enter the password from the link owner to continue.
            </p>

            <form className="mt-8 animate-[fadeUp_420ms_ease-out_both] text-left" onSubmit={handleProtectedAccess}>
              <label className="mb-3 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#9ca7bd]" htmlFor="redirect-password">
                Password
              </label>
              <div className="flex min-h-14 items-center gap-2 rounded-[20px] bg-[#22233d]/75 px-4 text-[#9ca7bd] transition duration-300 focus-within:bg-[#272943]/90 focus-within:ring-1 focus-within:ring-[#cf69ff]/45 sm:gap-3 sm:px-5">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
                  <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                  <path d="M6 11h12v9H6z" />
                </svg>
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-base font-bold text-white outline-none placeholder:text-[#8d98ae] sm:text-lg"
                  id="redirect-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  className="grid size-9 shrink-0 place-items-center rounded-full text-[#9ca7bd] transition hover:bg-white/5 hover:text-white"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
                    {showPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a3 3 0 0 0 3.8 3.8" />
                        <path d="M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a16.4 16.4 0 0 1-3.1 4.2" />
                        <path d="M6.6 6.6C3.7 8.3 2 12 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.2-.8" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {passwordError && (
                <p className="mt-3 rounded-2xl border border-[#ff7090]/30 bg-[#481426]/45 px-4 py-3 text-sm font-bold text-[#ffd5dc]" role="alert">
                  {passwordError}
                </p>
              )}

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#04e1c0,#09d3b7)] px-6 font-extrabold text-[#02151a] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 sm:w-auto" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Unlocking" : "Unlock link"}
                </button>
                <Link className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 font-extrabold text-white transition hover:border-white/20 hover:bg-white/10 sm:w-auto" to="/">
                  Create a new link
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mx-auto inline-flex min-h-10 items-center rounded-full border border-[#ff7090]/25 bg-[#481426]/45 px-4 text-sm font-extrabold uppercase tracking-[0.14em] text-[#ffd5dc]">
              {content!.eyebrow}
            </div>
            <h1 className="mt-7 text-3xl font-black leading-tight text-white sm:text-5xl">{content!.title}</h1>
            <p className="mx-auto mt-4 max-w-[470px] text-base font-medium leading-relaxed text-[#a7b0c5] sm:text-lg">
              {content!.description}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#04e1c0,#09d3b7)] px-6 font-extrabold text-[#02151a] transition hover:-translate-y-0.5 sm:w-auto" to="/">
                Create a new link
              </Link>
              <button className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-6 font-extrabold text-white transition hover:border-white/20 hover:bg-white/10 sm:w-auto" type="button" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default RedirectingPage;

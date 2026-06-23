import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../App.css";
import { API_BASE_URL } from "../api/config";

type RedirectStatus = "loading" | "not-found" | "error";

const statusContent: Record<Exclude<RedirectStatus, "loading">, {
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

        setStatus("error");
      }
    };

    handleRedirect();
  }, [shortCode]);

  const content = status === "loading" ? null : statusContent[status];

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#07101d] px-5 py-10 text-[#eef6ff]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:86px_86px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,214,190,0.28),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(197,77,255,0.24),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(5,9,18,0.65)_100%)]" />

      <section className="relative z-10 w-full max-w-[620px] animate-[fadeUp_650ms_ease-out_both] rounded-[32px] border border-white/10 bg-[#08101e]/75 p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-10">
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
            <h1 className="mt-7 text-3xl font-black text-white sm:text-5xl">Opening your link...</h1>
            <p className="mx-auto mt-4 max-w-[430px] text-base font-medium leading-relaxed text-[#a7b0c5] sm:text-lg">
              Hold tight while Snip finds the destination and sends you there.
            </p>
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
              <Link className="flex min-h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#04e1c0,#09d3b7)] px-6 font-extrabold text-[#02151a] transition hover:-translate-y-0.5" to="/">
                Create a new link
              </Link>
              <button className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-6 font-extrabold text-white transition hover:border-white/20 hover:bg-white/10" type="button" onClick={() => window.location.reload()}>
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

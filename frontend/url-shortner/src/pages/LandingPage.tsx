import "../App.css";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { shortUrlGenerator } from "../api/shortUrlGenerator";

type IconName = "link" | "github" | "zap" | "chart" | "shield" | "globe" | "spark";

type Feature = {
  icon: IconName;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: "zap",
    title: "Lightning fast",
    description: "Edge-ready redirects that keep campaigns, bios, and launches feeling instant.",
  },
  {
    icon: "chart",
    title: "Live analytics",
    description: "Track clicks, sources, devices, and referrers with a focused real-time view.",
  },
  {
    icon: "shield",
    title: "Safe & private",
    description: "Clean links with sensible validation and no messy tracking pixels by default.",
  },
  {
    icon: "globe",
    title: "Custom domains",
    description: "Turn every shared link into a branded touchpoint your audience can trust.",
  },
];

const stats = [
  { value: "12.4B", label: "Links served" },
  { value: "<30ms", label: "Median redirect" },
  { value: "99.99%", label: "Uptime, measured" },
];

const iconPaths: Record<IconName, string[]> = {
  link: ["M10 8H7a4 4 0 0 0 0 8h3", "M14 8h3a4 4 0 0 1 0 8h-3", "M8 12h8"],
  github: [
    "M15 22v-4a4.8 4.8 0 0 0-1.3-3.7c4.3-.5 8.8-2.1 8.8-9.5 0-2.1-.7-3.8-1.9-5.1.2-.5.8-2.4-.2-5.1",
    "M15.4 3.4a18.1 18.1 0 0 0-6.8 0",
    "M8 22v-3.2c0-.9.3-1.9 1.1-2.6-3.6-.5-7.4-1.9-7.4-8 0-1.8.6-3.2 1.7-4.4-.2-.5-.7-2.1.2-4.4",
  ],
  zap: ["m13 2-2 7h8l-10 13 2-8H5l8-12Z"],
  chart: ["M4 19V5", "M4 19h16", "M8 16V9", "M12 16V7", "M16 16v-4"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "m9.5 12 1.8 1.8L15 10"],
  globe: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 0 20", "M12 2a15.3 15.3 0 0 0 0 20"],
  spark: ["M12 3v5", "M12 16v5", "M3 12h5", "M16 12h5", "m5.6 5.6 3.5 3.5", "m14.9 14.9 3.5 3.5", "m18.4 5.6-3.5 3.5", "m9.1 14.9-3.5 3.5"],
};

const Icon = ({ name, className = "" }: { name: IconName; className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.2"
  >
    {iconPaths[name].map((path) => (
      <path d={path} key={path} />
    ))}
  </svg>
);

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const LandingPage = () => {
  const [webUrl, setWebUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const displayHost = useMemo(() => {
    if (!shortUrl) {
      return "snip.link/your-link";
    }

    return shortUrl.replace(/^https?:\/\//i, "");
  }, [shortUrl]);

  const handleShortening = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const urlToShorten = normalizeUrl(webUrl);

    if (!urlToShorten) {
      setErrorMessage("Paste a URL first and we will shrink it.");
      setShortUrl("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setCopied(false);

    try {
      const response = await shortUrlGenerator(urlToShorten);
      setShortUrl(`${window.location.origin}/${response.shortCode}`);
    } catch {
      setShortUrl("");
      setErrorMessage("We could not shorten that link. Check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch {
      setErrorMessage("Copy failed. You can still select the link manually.");
    }
  };

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (webUrl) {
      setErrorMessage("");
    }
  }, [webUrl]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07101d] px-5 py-5 text-[#eef6ff] sm:px-7 lg:px-12 xl:px-20 xl:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px)] bg-[size:90px_90px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_11%_3%,rgba(0,214,190,0.34),transparent_28%),radial-gradient(circle_at_88%_68%,rgba(197,77,255,0.26),transparent_31%),radial-gradient(circle_at_55%_76%,rgba(0,134,214,0.18),transparent_33%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(5,9,18,0.58)_100%),linear-gradient(180deg,rgba(7,16,29,0)_0%,rgba(7,16,29,0.58)_88%)]" />
      <div className="pointer-events-none absolute left-[22%] top-[505px] h-28 w-80 animate-[glowDrift_9s_ease-in-out_infinite] bg-[#04e1c0]/45 blur-[54px]" />
      <div className="pointer-events-none absolute bottom-5 right-[4%] h-36 w-96 animate-[glowDrift_11s_ease-in-out_infinite_reverse] bg-[#cc50ff]/40 blur-[58px]" />

      <nav className="relative z-10 grid animate-[fadeUp_600ms_ease-out_both] grid-cols-[auto_1fr] items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-6" aria-label="Primary navigation">
        <a className="flex items-center gap-3 justify-self-start text-2xl font-extrabold text-white sm:text-[27px]" href="/" aria-label="Snip home">
          <span className="grid size-10 place-items-center rounded-full bg-[#05dac1] text-[#02181d] shadow-[0_0_40px_rgba(5,218,193,0.32)] sm:size-12">
            <Icon name="link" className="size-5" />
          </span>
          <span>snip</span>
        </a>

        <div className="hidden justify-self-center text-lg font-semibold text-[#99a4bb] lg:flex lg:gap-10">
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#why-snip">Why snip</a>
          <a className="transition hover:text-white" href="#pricing">Pricing</a>
        </div>

        <div className="flex justify-self-end gap-2 sm:gap-4">
          <a
            className="hidden min-h-11 items-center gap-3 rounded-full border border-white/10 bg-[#0b0c1c]/40 px-5 text-base font-bold text-[#a7adc0] transition hover:-translate-y-0.5 hover:text-white sm:flex xl:min-h-12 xl:text-lg"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" className="size-[22px]" />
            Star
          </a>
          <a className="flex min-h-10 items-center justify-center rounded-full bg-[#eef2ff] px-5 text-base font-bold text-[#0c1020] shadow-[0_18px_42px_rgba(238,242,255,0.13)] transition hover:-translate-y-0.5 sm:min-h-11 sm:px-6 xl:min-h-12 xl:px-7 xl:text-lg" href="#shorten">
            Sign in
          </a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto mt-16 flex min-h-[520px] max-w-[950px] flex-col items-center text-center sm:mt-20 lg:mt-24 xl:mt-28 xl:min-h-[590px]" id="shorten">
        <div className="inline-flex min-h-10 animate-[fadeUp_650ms_ease-out_100ms_both] items-center gap-3 rounded-full border border-white/10 bg-[#0b1221]/55 px-4 text-sm font-semibold text-[#a8b2c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:text-base">
          <span className="size-2.5 animate-[softPulse_2.4s_ease-in-out_infinite] rounded-full bg-[#06d4bf] shadow-[0_0_22px_rgba(6,212,191,0.85)]" />
          Now with branded domains & QR codes
        </div>

        <h1 className="mt-6 max-w-[760px] animate-[fadeUp_700ms_ease-out_190ms_both] text-[46px] font-black leading-[1.02] tracking-normal text-white sm:text-[62px] lg:mt-8 lg:text-[78px] xl:text-[88px]">
          Tiny links.
          <span className="block bg-[linear-gradient(90deg,#b9f5ea_0%,#08dfc4_39%,#87bfe0_68%,#e45cff_100%)] bg-clip-text text-transparent">
            Big impact.
          </span>
        </h1>

        <p className="mt-5 max-w-[760px] animate-[fadeUp_700ms_ease-out_280ms_both] text-base font-medium leading-relaxed text-[#a7b0c5] sm:text-lg lg:text-xl xl:text-[22px]">
          Snip turns ugly, unmanageable URLs into elegant, trackable links in a single click.
          Built for marketers, creators, and teams that live online.
        </p>

        <form className="mt-9 grid w-full max-w-[900px] animate-[fadeUp_700ms_ease-out_370ms_both] grid-cols-1 gap-3 rounded-[26px] border border-[#08dcc3]/50 bg-[#08101e]/80 p-3 shadow-[0_0_52px_rgba(5,218,193,0.2),0_40px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl transition duration-300 hover:border-[#08dcc3]/70 hover:shadow-[0_0_62px_rgba(5,218,193,0.24),0_40px_90px_rgba(0,0,0,0.32)] sm:p-4 lg:mt-11 lg:grid-cols-[minmax(0,1fr)_auto] lg:rounded-[32px]" onSubmit={handleShortening}>
          <label className="sr-only" htmlFor="long-url">Paste your long URL</label>
          <div className="flex min-h-14 min-w-0 items-center gap-3 rounded-[20px] bg-[#22233d]/75 px-4 text-[#9ca7bd] lg:min-h-16 lg:gap-4 lg:rounded-[24px] lg:px-5">
            <Icon name="link" className="size-[22px] shrink-0" />
            <input
              className="w-full min-w-0 border-0 bg-transparent text-base font-semibold text-white outline-none placeholder:text-[#98a2b8] disabled:cursor-wait sm:text-lg lg:text-xl"
              id="long-url"
              type="text"
              inputMode="url"
              placeholder="Paste your long URL here..."
              value={webUrl}
              onChange={(event) => setWebUrl(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <button className="flex min-h-14 items-center justify-center gap-3 rounded-[20px] bg-[linear-gradient(135deg,#04e1c0,#09d3b7)] px-7 text-base font-extrabold text-[#02151a] shadow-[0_20px_55px_rgba(5,218,193,0.24)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-75 sm:text-lg lg:min-h-16 lg:rounded-[24px] lg:px-8 lg:text-xl" type="submit" disabled={isLoading}>
            <Icon name="spark" className="size-[22px]" />
            {isLoading ? "Shortening" : "Shorten"}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>

        {(errorMessage || shortUrl) && (
          <div className={`mt-5 flex w-full max-w-[760px] flex-col gap-4 rounded-[24px] border p-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between ${errorMessage ? "border-[#ff7090]/30 bg-[#481426]/55" : "border-white/10 bg-[#0a1221]/75"}`} role="status">
            {errorMessage ? (
              <p className="m-0 text-base font-bold text-[#ffd5dc]">{errorMessage}</p>
            ) : (
              <>
                <div className="min-w-0">
                  <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#8d98ae]">Your short URL</span>
                  <a className="block max-w-full [overflow-wrap:anywhere] bg-[linear-gradient(90deg,#b9f5ea_0%,#08dfc4_39%,#87bfe0_68%,#e45cff_100%)] bg-clip-text text-xl font-extrabold text-transparent sm:text-[22px]" href={shortUrl} target="_blank" rel="noreferrer">
                    {displayHost}
                  </a>
                </div>
                <button className="min-h-11 rounded-2xl border-0 bg-white/10 px-5 font-extrabold text-white transition hover:bg-white/15 sm:w-auto" type="button" onClick={handleCopy}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </>
            )}
          </div>
        )}
      </section>

      <section className="relative z-10 mt-10 lg:mt-16" id="features">
        <div className="max-w-[1030px]">
          <h2 className="m-0 max-w-[900px] text-[36px] font-black leading-tight tracking-normal text-white sm:text-[48px] xl:text-[60px]">
            Everything you need.{" "}
            <span className="bg-[linear-gradient(90deg,#b9f5ea_0%,#08dfc4_39%,#87bfe0_68%,#e45cff_100%)] bg-clip-text text-transparent">
              Nothing you don't.
            </span>
          </h2>
          <p className="mt-4 text-lg font-medium text-[#a4afc4] lg:text-[22px]">
            A focused toolkit for the people who live and breathe links.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 xl:mt-12 xl:grid-cols-4 xl:gap-6">
          {features.map((feature) => (
            <article className="group min-h-[220px] animate-[fadeUp_650ms_ease-out_both] rounded-[26px] border border-white/10 bg-[#08101e]/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-[#03e0c1]/35 hover:bg-[#0b1728]/75 hover:shadow-[0_24px_70px_rgba(0,0,0,0.24)] xl:min-h-[260px] xl:p-7" key={feature.title}>
              <div className="grid size-14 place-items-center rounded-2xl bg-[#03e0c1]/15 text-[#03e0c1] transition duration-300 group-hover:scale-105 group-hover:bg-[#03e0c1]/20">
                <Icon name={feature.icon} className="size-6" />
              </div>
              <h3 className="mt-7 text-xl font-extrabold leading-tight text-white xl:text-2xl">{feature.title}</h3>
              <p className="mt-3 max-w-[270px] text-base font-medium leading-relaxed text-[#a0abc0] xl:text-lg">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-14 grid animate-[fadeUp_700ms_ease-out_both] grid-cols-1 gap-8 rounded-[30px] border border-white/10 bg-[#0a1220]/75 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-lg md:grid-cols-3 md:text-left lg:mt-20 lg:p-12 xl:p-14" id="why-snip" aria-label="Snip platform metrics">
        {stats.map((stat) => (
          <div className="min-w-0" key={stat.label}>
            <strong className="block bg-[linear-gradient(90deg,#b9f5ea_0%,#08dfc4_39%,#87bfe0_68%,#e45cff_100%)] bg-clip-text text-[44px] font-extrabold leading-none text-transparent sm:text-[56px] xl:text-[70px]">
              {stat.value}
            </strong>
            <span className="mt-4 block text-sm font-bold uppercase tracking-[0.14em] text-[#a5aec4] sm:text-base xl:text-lg">
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      <section className="relative z-10 mt-20 flex animate-[fadeUp_700ms_ease-out_both] flex-col items-center text-center lg:mt-28" id="pricing">
        <h2 className="m-0 text-[38px] font-black leading-tight tracking-normal text-white sm:text-[50px] xl:text-[60px]">
          Start shrinking in seconds.
        </h2>
        <p className="mt-4 text-lg font-medium text-[#a5aec3] xl:text-[22px]">
          Free forever for personal use. No credit card. No nonsense.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a className="flex min-h-14 min-w-[210px] items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#04e1c0,#09d3b7)] px-7 text-base font-extrabold text-[#02151a] shadow-[0_20px_55px_rgba(5,218,193,0.24)] transition hover:-translate-y-0.5 xl:min-h-16 xl:text-xl" href="#shorten">
            Get started free
          </a>
          <a className="flex min-h-14 min-w-[170px] items-center justify-center rounded-[22px] border border-white/10 bg-[#09101e]/60 px-7 text-base font-extrabold text-white transition hover:-translate-y-0.5 hover:border-white/20 xl:min-h-16" href="#features">
            See features
          </a>
        </div>
      </section>

      <footer className="relative z-10 mt-20 animate-[fadeUp_700ms_ease-out_both] border-t border-white/10 pt-8 text-[#9ba6bc] lg:mt-24">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <a className="flex items-center gap-3 text-xl font-extrabold text-white" href="/" aria-label="Snip home">
            <span className="grid size-9 place-items-center rounded-full bg-[#05dac1] text-[#02181d]">
              <Icon name="link" className="size-4" />
            </span>
            <span>snip</span>
          </a>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a className="transition hover:text-white" href="#features">Features</a>
            <a className="transition hover:text-white" href="#why-snip">Why snip</a>
            <a className="transition hover:text-white" href="#pricing">Pricing</a>
            <a className="transition hover:text-white" href="#shorten">Shorten URL</a>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="m-0">&copy; 2026 Snip. Built for fast, clean link sharing.</p>
          <p className="m-0">Secure redirects. Clean analytics. No clutter.</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;

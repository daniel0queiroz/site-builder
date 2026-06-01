import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import api from "@/configs/axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/* ── Nexio sparkle logo ─────────────────────────────────── */
const NexioLogo = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nexio-bg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#1e3a8a" />
        <stop offset="50%"  stopColor="#2563eb" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
      <linearGradient id="nexio-glow" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <rect width="34" height="34" rx="9" fill="url(#nexio-bg)" />
    <rect x="0.75" y="0.75" width="32.5" height="32.5" rx="8.5" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
    <path d="M17 7.5L18.9 15.1L26.5 17L18.9 18.9L17 26.5L15.1 18.9L7.5 17L15.1 15.1Z" fill="url(#nexio-glow)" />
    <path d="M25.5 8.5L26.3 11.7L29.5 12.5L26.3 13.3L25.5 16.5L24.7 13.3L21.5 12.5L24.7 11.7Z" fill="white" fillOpacity="0.55" />
  </svg>
);

const LANGUAGES = [
  { code: "en",    label: "EN" },
  { code: "pt-BR", label: "PT" },
  { code: "es",    label: "ES" },
];

/* ── Component ──────────────────────────────────────────── */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [credits, setCredits] = useState(0);
  const { t, i18n } = useTranslation();

  const { data: session } = authClient.useSession();

  const getCredits = async () => {
    try {
      const { data } = await api.get("/api/user/credits");
      setCredits(data.credits);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (session?.user) {
      getCredits();
    }
  }, [session?.user]);

  const navLinks = [
    { to: "/",          label: t("nav.home")       },
    { to: "/projects",  label: t("nav.myProjects") },
    { to: "/community", label: t("nav.community")  },
    { to: "/pricing",   label: t("nav.pricing")    },
  ];

  return (
    <>
      {/* ── Mobile overlay menu ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[rgba(4,13,26,0.97)] backdrop-blur-2xl flex flex-col items-center justify-center gap-2">
          {navLinks.map(({ to, label }) => {
            const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`
                  text-lg font-medium px-6 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "text-white bg-white/[0.09]"
                    : "text-slate-200 hover:text-white hover:bg-white/[0.07]"}
                `}
              >
                {label}
              </Link>
            );
          })}

          {/* Language switcher inside mobile menu */}
          <div className="flex items-center gap-1 mt-6 bg-white/[0.06] border border-white/[0.12] rounded-lg p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setMobileOpen(false); }}
                className={`
                  w-12 text-sm font-bold py-2 rounded-md transition-all duration-200 tracking-wide
                  ${i18n.language === lang.code
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/10"}
                `}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="mt-4 p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}

      <nav
        className="
          sticky top-0 z-40
          relative flex items-center
          w-full px-6 md:px-10 py-3.5
          bg-[rgba(4,13,26,0.75)]
          backdrop-blur-xl
          border-b border-white/[0.08]
          shadow-[0_1px_0_rgba(255,255,255,0.05)]
        "
      >
        {/* ── Brand — left ── */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <NexioLogo />
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight">
            Nexio
          </span>
        </Link>

        {/* ── Nav links — absolutely centered, never affects sides ── */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 text-sm">
          {navLinks.map(({ to, label }) => {
            const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`
                  relative px-4 py-2 rounded-md font-medium
                  transition-all duration-200
                  after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px
                  after:bg-blue-400 after:transition-transform after:duration-200
                  hover:after:scale-x-100
                  ${isActive
                    ? "text-white bg-white/[0.09] after:scale-x-100"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.07] after:scale-x-0"}
                `}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Right side: lang switcher + auth / credits ── */}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          {/* Language switcher — desktop only, moves to mobile overlay on small screens */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/[0.06] border border-white/[0.12] rounded-lg p-0.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`
                  w-8 text-[11px] font-bold py-1 rounded-md transition-all duration-200 tracking-wide
                  ${i18n.language === lang.code
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/10"}
                `}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {!session?.user ? (
            <button
              onClick={() => navigate("/auth/signin")}
              className="
                md:w-[130px]
                bg-gradient-to-r from-blue-600 to-blue-500
                hover:from-blue-500 hover:to-indigo-500
                text-white text-sm font-semibold
                px-4 py-2 rounded-lg
                transition-all duration-300
                btn-glow cursor-pointer whitespace-nowrap
              "
            >
              <span className="hidden md:inline">{t("nav.getStarted")}</span>
              <span className="md:hidden">Login</span>
            </button>
          ) : (
            <>
              {/* Credits badge — label hidden on mobile to save space */}
              <div className="
                flex items-center gap-1.5
                md:min-w-[100px] px-3 py-1.5 rounded-full text-xs font-semibold
                bg-blue-500/15 border border-blue-500/30
              ">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path d="M6 1L7 4.5H10.5L7.8 6.8L8.8 10.5L6 8.2L3.2 10.5L4.2 6.8L1.5 4.5H5Z" fill="#93c5fd" fillOpacity="0.9"/>
                </svg>
                <span className="text-blue-300 font-bold tabular-nums">{credits}</span>
                <span className="hidden md:inline text-slate-400">{t("nav.credits")}</span>
              </div>
              <UserButton size="icon" />
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white transition"
            aria-label="Open menu"
          >
            <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

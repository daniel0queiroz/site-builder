import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import api from "@/configs/axios";
import { toast } from "sonner";

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
    {/* Rounded square background */}
    <rect width="34" height="34" rx="9" fill="url(#nexio-bg)" />
    {/* Subtle inner border for depth */}
    <rect x="0.75" y="0.75" width="32.5" height="32.5" rx="8.5" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />

    {/* Main 4-pointed sparkle — the AI magic mark */}
    <path
      d="M17 7.5L18.9 15.1L26.5 17L18.9 18.9L17 26.5L15.1 18.9L7.5 17L15.1 15.1Z"
      fill="url(#nexio-glow)"
    />

    {/* Small accent sparkle — top right corner */}
    <path
      d="M25.5 8.5L26.3 11.7L29.5 12.5L26.3 13.3L25.5 16.5L24.7 13.3L21.5 12.5L24.7 11.7Z"
      fill="white"
      fillOpacity="0.55"
    />
  </svg>
);

/* ── Component ──────────────────────────────────────────── */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);

  const { data: session } = authClient.useSession();

  const getCredits = async () => {
    try {
      const { data } = await api.get("/api/user/credits");
      setCredits(data.credits);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      getCredits();
    }
  }, [session?.user]);

  const navLinks = [
    { to: "/",          label: "Home"        },
    { to: "/projects",  label: "My Projects" },
    { to: "/community", label: "Community"   },
    { to: "/pricing",   label: "Pricing"     },
  ];

  return (
    <>
      <nav
        className="
          sticky top-0 z-50
          flex items-center w-full px-6 md:px-10 py-3.5
          justify-between
          bg-[rgba(4,13,26,0.70)]
          backdrop-blur-xl
          border-b border-white/[0.06]
          shadow-[0_1px_0_rgba(255,255,255,0.04)]
        "
      >
        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <NexioLogo />
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight">
            Nexio
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div
          id="menu"
          className={`
            ${mobileOpen ? "max-md:left-0" : "max-md:-left-full"}
            max-md:fixed max-md:top-0 max-md:h-screen max-md:w-full max-md:z-50
            max-md:flex-col max-md:justify-center
            max-md:bg-[rgba(4,13,26,0.95)] max-md:backdrop-blur-2xl
            md:static md:flex-row md:h-auto md:w-auto md:bg-transparent md:backdrop-blur-none
            flex items-center gap-0.5 text-sm
            transition-all duration-300
          `}
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="
                relative px-4 py-2 text-slate-300 hover:text-white
                transition-colors duration-200
                after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px
                after:bg-blue-400 after:scale-x-0 after:transition-transform after:duration-200
                hover:after:scale-x-100
              "
            >
              {label}
            </Link>
          ))}

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden mt-4 p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* ── Right side: auth / credits ── */}
        <div className="flex items-center gap-3">
          {!session?.user ? (
            <button
              onClick={() => navigate("/auth/signin")}
              className="
                relative overflow-hidden
                bg-gradient-to-r from-blue-600 to-blue-500
                hover:from-blue-500 hover:to-indigo-500
                text-white text-sm font-medium
                px-5 py-2 rounded-lg
                transition-all duration-300
                btn-glow
                cursor-pointer
              "
            >
              Get started
            </button>
          ) : (
            <>
              <div className="
                flex items-center gap-1.5 px-3.5 py-1.5
                rounded-full text-xs font-medium
                bg-blue-500/10 border border-blue-500/20
                text-blue-200
              ">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7 4.5H10.5L7.8 6.8L8.8 10.5L6 8.2L3.2 10.5L4.2 6.8L1.5 4.5H5Z" fill="currentColor" fillOpacity="0.8"/>
                </svg>
                <span className="text-slate-300">Credits:</span>
                <span className="text-blue-300 font-semibold">{credits}</span>
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

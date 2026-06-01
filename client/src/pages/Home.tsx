import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function Home() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [input, setInput] = React.useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!session?.user) {
        return toast.error(t("home.errorSignIn"));
      } else if (!input.trim()) {
        return toast.error(t("home.errorEmpty"));
      }
      setLoading(true);
      const { data } = await api.post("/api/user/project", {
        initial_prompt: input,
      });
      setLoading(false);
      navigate(`/projects/${data.projectId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <section className="relative flex flex-col items-center text-white pb-24 px-4 overflow-hidden">

      {/* ── Hero glow orb ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-80px] left-1/2 -translate-x-1/2 w-[760px] h-[500px] rounded-full opacity-60 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.28) 0%, rgba(99,102,241,0.12) 45%, transparent 75%)",
          filter: "blur(1px)",
        }}
      />

      {/* ── Announce badge ── */}
      <div
        className="
          animate-fade-in
          flex items-center gap-2.5
          mt-24 mb-1
          px-1 pr-4 py-1
          rounded-full
          bg-blue-500/10 border border-blue-500/25
          text-sm text-slate-300
        "
      >
        <span className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white text-[11px] font-semibold tracking-wide uppercase
          px-3 py-0.5 rounded-full
        ">
          {t("home.badge")}
        </span>
        <span>{t("home.badgeText")}</span>
      </div>

      {/* ── Headline ── */}
      <h1
        className="
          animate-fade-in delay-100
          text-center
          text-[42px] leading-[1.15] tracking-tight
          md:text-[64px] md:leading-[1.1]
          mt-6 font-bold max-w-3xl
          text-gradient
        "
      >
        {t("home.headline")}
      </h1>

      {/* ── Sub-headline ── */}
      <p className="animate-fade-in delay-200 text-center text-base md:text-lg max-w-md mt-4 text-slate-400 leading-relaxed">
        {t("home.subheadline")}
      </p>

      {/* ── Prompt form ── */}
      <form
        onSubmit={onSubmitHandler}
        className="
          animate-fade-in delay-300
          relative
          max-w-2xl w-full mt-10
          rounded-2xl p-[1px]
          bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent
          focus-within:from-blue-400/60 focus-within:via-indigo-400/30
          transition-all duration-500
        "
      >
        <div className="
          relative rounded-2xl
          bg-[rgba(4,13,26,0.85)]
          backdrop-blur-xl
          p-4
          shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        ">
          <textarea
            onChange={(e) => setInput(e.target.value)}
            className="
              bg-transparent outline-none
              text-slate-200 placeholder-slate-500
              resize-none w-full
              text-[15px] leading-relaxed
            "
            rows={4}
            placeholder={t("home.placeholder")}
            required
          />
          <div className="flex items-center justify-between mt-2">
            {/* Prompt hints */}
            <div className="hidden sm:flex items-center gap-2">
              {[
                t("home.hintLanding"),
                t("home.hintPortfolio"),
                t("home.hintSaas"),
              ].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setInput((v) => v ? v : hint + " — ")}
                  className="
                    text-[11px] px-2.5 py-1 rounded-md
                    bg-white/5 border border-white/10
                    text-slate-400 hover:text-slate-200 hover:bg-white/10
                    transition-colors duration-200
                  "
                >
                  {hint}
                </button>
              ))}
            </div>

            {/* Submit button */}
            <button
              disabled={loading}
              className="
                ml-auto flex items-center gap-2
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-500 hover:to-indigo-500
                text-white text-sm font-semibold
                px-5 py-2.5 rounded-xl
                transition-all duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
                btn-glow cursor-pointer
                shadow-[0_4px_16px_rgba(59,130,246,0.3)]
              "
            >
              {!loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5L9.2 7L14.5 8L9.2 9L8 14.5L6.8 9L1.5 8L6.8 7Z" fill="currentColor"/>
                  </svg>
                  {t("home.createButton")}
                </>
              ) : (
                <>
                  {t("home.creating")}
                  <Loader2Icon className="animate-spin size-4 text-white" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── Social proof ── */}
      <div className="animate-fade-in delay-400 mt-20 flex flex-col items-center gap-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-600 font-medium">
          {t("home.trustedBy")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
          {[
            { src: "/logos/framer.svg",    name: "Framer"    },
            { src: "/logos/huawei.svg",    name: "Huawei"    },
            { src: "/logos/instagram.svg", name: "Instagram" },
            { src: "/logos/microsoft.svg", name: "Microsoft" },
            { src: "/logos/walmart.svg",   name: "Walmart"   },
          ].map(({ src, name }) => (
            <div
              key={name}
              className="flex items-center gap-2.5 opacity-35 hover:opacity-60 transition-opacity duration-300 group"
            >
              <img
                src={src}
                alt={name}
                className="h-5 w-5 object-contain shrink-0"
              />
              <span className="text-white text-sm font-semibold tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Home;

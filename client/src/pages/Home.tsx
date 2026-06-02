import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";
import { Loader2Icon, ChevronDownIcon, XIcon, ExternalLinkIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { dummyProjects } from "../assets/assets";
import Footer from "../components/Footer";

const EXAMPLES = dummyProjects;

const HOW_STEPS = [
  {
    number: "01",
    titleKey: "home.howStep1Title",
    descKey: "home.howStep1Desc",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    number: "02",
    titleKey: "home.howStep2Title",
    descKey: "home.howStep2Desc",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
  },
  {
    number: "03",
    titleKey: "home.howStep3Title",
    descKey: "home.howStep3Desc",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

function PreviewModal({ code, prompt, onClose }: { code: string; prompt: string; onClose: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const openInTab = () => {
    const blob = new Blob([code], { type: "text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-5 py-3 bg-gray-950 border-b border-white/[0.08] shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-slate-400 text-sm italic line-clamp-1 max-w-lg">"{prompt}"</p>
        <div className="flex items-center gap-2">
          <button
            onClick={openInTab}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] transition-all"
          >
            <ExternalLinkIcon size={13} />
            {t("home.exampleOpenTab")}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <iframe srcDoc={code} className="w-full h-full" sandbox="allow-scripts allow-same-origin" />
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`w-full text-left px-5 pt-5 rounded-xl cursor-pointer border transition-all duration-200
        ${open ? "bg-white/[0.05] border-blue-500/30 pb-0" : "bg-white/[0.03] border-white/[0.07] hover:border-blue-500/20 pb-5"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-white font-medium text-sm">{q}</span>
        <ChevronDownIcon
          className={`shrink-0 w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* grid trick: 0fr → 1fr gives a smooth height transition without JS measurement */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="text-slate-400 text-sm leading-relaxed border-t border-white/[0.06] mt-3 pt-3 pb-5">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { i18n } = useTranslation();
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ code: string; prompt: string } | null>(null);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!session?.user) return toast.error(t("home.errorSignIn"));
      if (!input.trim()) return toast.error(t("home.errorEmpty"));
      setLoading(true);
      const { data } = await api.post("/api/user/project", { initial_prompt: input, lang: i18n.language });
      setLoading(false);
      navigate(`/projects/${data.projectId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const faqs = t("home.faqs", { returnObjects: true }) as { q: string; a: string }[];
  const editFeatures = t("home.exampleEditFeatures", { returnObjects: true }) as string[];
  const prompts = t("home.examplePrompts", { returnObjects: true }) as Record<string, string>;

  return (
    <div className="relative text-white overflow-x-hidden">
      {preview && (
        <PreviewModal
          code={preview.code}
          prompt={preview.prompt}
          onClose={() => setPreview(null)}
        />
      )}

      {/* ══ HERO ══ */}
      <section className="relative flex flex-col items-center pb-24 px-4 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute top-[-80px] left-1/2 -translate-x-1/2 w-[760px] h-[500px] rounded-full opacity-60 animate-pulse-glow"
          style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.28) 0%, rgba(99,102,241,0.12) 45%, transparent 75%)", filter: "blur(1px)" }}
        />

        <div className="animate-fade-in flex items-center gap-2.5 mt-24 mb-1 px-1 pr-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-sm text-slate-300">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-semibold tracking-wide uppercase px-3 py-0.5 rounded-full">
            {t("home.badge")}
          </span>
          <span>{t("home.badgeText")}</span>
        </div>

        <h1 className="animate-fade-in delay-100 text-center text-[38px] leading-[1.15] tracking-tight md:text-[60px] md:leading-[1.1] mt-6 font-bold max-w-3xl text-gradient">
          {t("home.headline")}
        </h1>

        <p className="animate-fade-in delay-200 text-center text-base md:text-lg max-w-lg mt-4 text-slate-400 leading-relaxed">
          {t("home.subheadline")}
        </p>

        <form onSubmit={onSubmitHandler}
          className="animate-fade-in delay-300 relative max-w-2xl w-full mt-10 rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent focus-within:from-blue-400/60 focus-within:via-indigo-400/30 transition-all duration-500"
        >
          <div className="relative rounded-2xl bg-[rgba(4,13,26,0.85)] backdrop-blur-xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <textarea
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent outline-none text-slate-200 placeholder-slate-500 resize-none w-full text-[15px] leading-relaxed"
              rows={4}
              placeholder={t("home.placeholder")}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <div className="hidden sm:flex items-center gap-2">
                {[t("home.hintLanding"), t("home.hintPortfolio"), t("home.hintSaas")].map((hint) => (
                  <button key={hint} type="button" onClick={() => setInput((v) => v ? v : hint + " — ")}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors duration-200"
                  >{hint}</button>
                ))}
              </div>
              <button disabled={loading}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed btn-glow cursor-pointer shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
              >
                {!loading ? (<><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.2 7L14.5 8L9.2 9L8 14.5L6.8 9L1.5 8L6.8 7Z" fill="currentColor"/></svg>{t("home.createButton")}</>) : (<>{t("home.creating")}<Loader2Icon className="animate-spin size-4 text-white" /></>)}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t("home.howTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_STEPS.map((step) => (
            <div key={step.number} className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/20 text-blue-300">{step.icon}</div>
                <span className="text-3xl font-bold text-white/10 select-none">{step.number}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{t(step.titleKey)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ EXAMPLES ══ */}
      <section className="px-4 pb-12 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t("home.examplesTitle")}</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">{t("home.examplesSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAMPLES.map((project) => {
            const translatedPrompt = prompts[project.id] ?? project.initial_prompt;
            return (
              <div
                key={project.id}
                onClick={() => project.current_code && setPreview({ code: project.current_code, prompt: translatedPrompt })}
                className="rounded-xl bg-gray-900/60 border border-gray-700 overflow-hidden hover:border-blue-500/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer group"
              >
                <div className="relative w-full h-44 bg-gray-900 overflow-hidden border-b border-gray-800">
                  {project.current_code ? (
                    <>
                      <iframe
                        srcDoc={project.current_code}
                        className="absolute top-0 left-0 pointer-events-none"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left" }}
                      />
                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                          <ExternalLinkIcon size={12} /> {t("home.exampleViewSite")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">No preview</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-medium">{t("home.examplePromptLabel")}</p>
                  <p className="text-slate-300 text-sm leading-snug line-clamp-2 italic">"{translatedPrompt}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ EDIT FEATURES ══ */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 md:p-8">
          <p className="text-slate-300 text-sm font-semibold mb-5 text-center md:text-left">{t("home.exampleEditCaption")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {editFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <span className="text-base leading-none">{f.slice(0, 2)}</span>
                <span className="text-slate-300 text-sm">{f.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="px-4 pb-24 max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-blue-500/50 via-indigo-500/30 to-purple-500/20">
          <div className="rounded-3xl bg-[rgba(4,13,26,0.90)] backdrop-blur-xl px-8 py-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{t("home.ctaTitle")}</h2>
            <p className="text-slate-400 text-base mb-8">{t("home.ctaSubtitle")}</p>
            <button
              onClick={() => session?.user ? document.querySelector("textarea")?.focus() : navigate("/auth/signin")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 btn-glow shadow-[0_4px_24px_rgba(59,130,246,0.4)] text-base"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.2 7L14.5 8L9.2 9L8 14.5L6.8 9L1.5 8L6.8 7Z" fill="currentColor"/></svg>
              {t("home.ctaButton")}
            </button>
            <p className="mt-5 text-sm text-slate-500">
              <Link to="/pricing" className="hover:text-blue-400 transition-colors">{t("home.ctaPricingNote")}</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="px-4 pb-28 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">{t("home.faqTitle")}</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

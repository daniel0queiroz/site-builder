import Footer from "../components/Footer";
import { authClient } from "@/lib/auth-client";
import api from "@/configs/axios";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";

function Pricing() {
  const { data: session } = authClient.useSession();
  const { t, i18n } = useTranslation();

  const planIds = ["basic", "pro", "enterprise"] as const;

  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) {
        return toast.error(t("pricing.errorLogin"));
      }
      const { data } = await api.post("/api/user/purchase-credits", {
        planId,
        locale: i18n.language,
      });
      window.location.href = data.payment_link;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto z-20 max-md:px-4 min-h-[80vh]">
        <div className="text-center mt-16">
          <h2 className="text-gray-100 text-3xl font-medium">
            {t("pricing.title")}
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* ── Credit packs ── */}
        <div className="pt-14 py-4 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {planIds.map((id) => {
              const plan = t(`pricing.plans.${id}`, { returnObjects: true }) as {
                name: string;
                price: string;
                description: string;
                features: string[];
              };
              const credits = id === "basic" ? 100 : id === "pro" ? 400 : 1000;
              return (
                <div
                  key={id}
                  className="flex flex-col p-6 bg-black/20 ring ring-blue-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-blue-500 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="my-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-300">
                      {" "}/ {credits} {t("pricing.credits")}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-6">{plan.description}</p>
                  <ul className="space-y-1.5 mb-6 text-sm flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="h-5 w-5 shrink-0 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePurchase(id)}
                    className="mt-auto w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-sm rounded-md transition-all"
                  >
                    {t("pricing.buyNow")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mx-auto text-center text-sm max-w-md mt-6 text-white/60 font-light">
          <Trans
            i18nKey="pricing.notice"
            components={{ bold: <span className="text-white font-medium" /> }}
          />
        </p>

        {/* ── Export card ── */}
        <div className="mt-16 px-4">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/20 to-transparent">
            <div className="rounded-2xl bg-black/30 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                    {t("pricing.exportCard.badge")}
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold mb-1">
                  {t("pricing.exportCard.title")}
                </h3>
                <p className="text-gray-400 text-sm mb-4 max-w-md">
                  {t("pricing.exportCard.description")}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(t("pricing.exportCard.features", { returnObjects: true }) as string[]).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="h-4 w-4 shrink-0 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Right */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" className="text-indigo-300 mb-0.5 shrink-0">
                      <path d="M6 1L7 4.5H10.5L7.8 6.8L8.8 10.5L6 8.2L3.2 10.5L4.2 6.8L1.5 4.5H5Z" fill="currentColor"/>
                    </svg>
                    <span className="text-4xl font-bold text-white">
                      {t("pricing.exportCard.creditsAmount")}
                    </span>
                  </div>
                  <p className="text-indigo-300 text-xs font-medium mt-0.5">
                    {t("pricing.exportCard.creditsLabel")}
                  </p>
                  <p className="text-gray-500 text-[11px] mt-1">
                    {t("pricing.exportCard.priceNote")}
                  </p>
                </div>
                <button
                  disabled
                  className="relative w-48 py-2.5 px-6 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-indigo-600 to-purple-600
                    opacity-60 cursor-not-allowed text-white whitespace-nowrap"
                >
                  {t("pricing.exportCard.button")}
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {t("pricing.exportCard.comingSoon")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default Pricing;

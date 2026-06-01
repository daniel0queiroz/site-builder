import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { authClient } from "./lib/auth-client";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authLocalizationPtBR, authLocalizationEs } from "./lib/authLocalization";

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const localization =
    i18n.language === "pt-BR"
      ? authLocalizationPtBR
      : i18n.language === "es"
      ? authLocalizationEs
      : undefined;

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={navigate}
      Link={(props) => <NavLink {...props} to={props.href} />}
      localization={localization}
    >
      {children}
    </AuthUIProvider>
  );
}

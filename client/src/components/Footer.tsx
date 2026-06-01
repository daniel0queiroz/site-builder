import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-4 text-gray-400 text-sm border-t border-gray-800 mt-16">
      <p>{t("footer.copyright")}</p>
    </div>
  );
};

export default Footer;

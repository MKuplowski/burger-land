"use client";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  const handleError = () => {
    reset();
  };

  return (
    <html>
      <body>
        <h2>{t("errors.somethingWentWrong")}</h2>
        <button onClick={handleError}>{t("errors.tryAgain")}</button>
      </body>
    </html>
  );
}
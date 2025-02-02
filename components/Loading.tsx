"use client";

import { useTranslations } from "next-intl";

export function Loading() {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-gray-500 text-2xl animate-pulse">{t("status.loading")}</div>
    </div>
  );
}

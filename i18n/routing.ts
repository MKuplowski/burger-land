import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

// translated urls for better SEO
export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/cart": {
      en: "/cart",
      pl: "/koszyk",
    },
    "/checkout": {
      en: "/checkout",
      pl: "/checkout",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const {Link, getPathname, redirect, usePathname, useRouter} =
    createNavigation(routing);

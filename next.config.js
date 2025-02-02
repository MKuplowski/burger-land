const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: { typedRoutes: true, reactCompiler: true },
};

module.exports = withNextIntl(config);
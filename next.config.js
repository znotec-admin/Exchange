
const pkg = require("./package.json");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const noise = require("./src/assets/noise.svg");

function assertEnv(keys, { optional = [] } = {}) {
  const missing = keys.filter((key) => {
    const value = process.env[key];
    return value == null || String(value).trim() === "";
  });

  if (missing.length && isProd) {
    throw new Error(
      `[next.config] Missing required env in production: ${missing.join(", ")}`,
    );
  }

  if (isDev && missing.length) {
    console.warn(
      `[next.config] Warning — unset env (ok in dev): ${missing.join(", ")}`,
    );
  }

  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`[next.config] Optional env unset: ${key}`);
    }
  }
}

assertEnv(["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_CHAIN_ID"], {
  optional: ["NEXT_PUBLIC_ESCROW_ADDRESS"],
});

const assetPrefix = (process.env.NEXT_PUBLIC_ASSET_PREFIX || "").replace(/\/$/, "");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",

  ...(assetPrefix ? { assetPrefix } : {}),
  ...(basePath ? { basePath } : {}),

  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.NEXT_SOURCEMAPS === "true",

  images: {
    unoptimized: true,
  },

  env: {
    // NEXT_PUBLIC_WATERMARK_BG: watermark,
    NEXT_PUBLIC_NOISE_BG: noise,
    NEXT_PUBLIC_APP_NAME: pkg.name,
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BUILD_ENV: isProd ? "production" : "development",
  },

  eslint: {
    ignoreDuringBuilds: process.env.NEXT_IGNORE_ESLINT === "true",
  },

  webpack: (config, { dev, isServer, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __ALPHANEX_BUILD__: JSON.stringify({
          version: pkg.version,
          time: new Date().toISOString(),
          server: isServer,
          dev,
        }),
      }),
    );
    return config;
  },

  generateBuildId: async () => {
    if (process.env.NEXT_BUILD_ID) return process.env.NEXT_BUILD_ID;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${pkg.name}-${pkg.version}-${stamp}`;
  },

  logging: isDev ? { fetches: { fullUrl: true } } : undefined,
};

module.exports = nextConfig;

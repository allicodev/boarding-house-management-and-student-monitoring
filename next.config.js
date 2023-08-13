/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      dns: false,
      tls: false,
      process: require.resolve("process/browser"),
    };

    return config;
  },
};

module.exports = nextConfig;

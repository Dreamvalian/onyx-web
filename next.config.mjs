/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.discordapp.com"],
  },
  output: "standalone",
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 2,
    optimizeCss: false,
  },
  swcMinify: false,
};

export default nextConfig;

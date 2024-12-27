/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    base_url: "https://guntursatyadev.my.id/api",
  },
  images: {
    domains: ["guntursatyadev.my.id"],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: false,
  },
  swcMinify: false,
}

export default nextConfig

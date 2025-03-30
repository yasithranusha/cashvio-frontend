/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cashvio.s3.eu-north-1.amazonaws.com" },
    ],
  },
};

export default nextConfig

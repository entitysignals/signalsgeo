/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@redefinition/ui", "@redefinition/design-tokens"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Removed 'output: export' to support dynamic server-side rendering for auth
  images: {
    unoptimized: true
  },
};

export default nextConfig;



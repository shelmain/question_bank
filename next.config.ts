import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // 禁用 ESLint 检查
        ignoreDuringBuilds: true,
    },
  /* config options here */
};

export default nextConfig;

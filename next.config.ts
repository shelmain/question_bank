import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // 禁用 ESLint 检查
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.output.chunkFilename = `static/chunks/[name].[contenthash].js`;
        return config;
    },
    // 添加资产前缀（如果使用CDN）
    assetPrefix: process.env.CDN_URL || '',
  /* config options here */
};

export default nextConfig;

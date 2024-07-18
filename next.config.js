/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['@mui/material', '@emotion/react', '@emotion/styled', 'react-icons'],
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    // CSSローダーのオプションをここに設定
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule) => {
          if (oneOfRule.use && oneOfRule.use.loader === 'next-css-loader') {
            oneOfRule.use.options.sourceMap = false;
          }
        });
      }
    });
    return config
  },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */

const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  allowedDevOrigins: ['esa-analytics.webagab.fr', 'https://esa-analytics.webagab.fr', 'esa-analytics-dev.webagab.fr', 'https://esa-analytics-dev.webagab.fr', 'localhost', 'http://localhost'],
  experimental: {
    mdxRs: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);

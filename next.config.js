/** @type {import('next').NextConfig} */

const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  allowedDevOrigins: ['esa.webagab.fr', 'https://esa.webagab.fr', 'localhost', 'http://localhost'], // 'industry-analytics-dev.go.esa.int', 'http://industry-analytics-dev.go.esa.int', 
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

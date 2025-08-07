import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */


const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Allow Google profile images
  },
};

module.exports = nextConfig;

export default nextConfig;

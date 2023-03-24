/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: true,
  env: {
    YOUTUBE_API_KEY: process.env.GOOGLE_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL
  }
}

module.exports = nextConfig

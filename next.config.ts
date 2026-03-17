import type { NextConfig } from 'next'

// GitHub Pages repo name (change if your repository differs)
const repo = 'swingrecorder-web'
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
}

export default nextConfig

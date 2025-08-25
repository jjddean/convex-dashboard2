import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // No redirects to /admin-dashboard
    ]
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Exclude docusign-esign from client-side bundling
      config.resolve = config.resolve || {}
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
      config.externals = config.externals || []
      config.externals.push('docusign-esign')
    }
    // Prefer relative resolution inside dependencies (can help with packages that use bare imports)
    config.resolve = config.resolve || {}
    config.resolve.preferRelative = true
    return config
  },
}

export default nextConfig

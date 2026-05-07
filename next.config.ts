import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {},
    cacheComponents: true,           // Cache Components (PPR nouvelle génération)
    // React Compiler temporarily disabled to avoid missing Babel plugin in this setup
    reactCompiler: false,            // React Compiler disabled (minimal, safe default)
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8005",
                pathname: "/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/azura/:path*",
                destination: "http://localhost:8005/api/:path*",
            },
        ];
    },
};

export default nextConfig;

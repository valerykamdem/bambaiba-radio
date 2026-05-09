import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {},
    cacheComponents: true,           // Cache Components (PPR nouvelle génération)
    // React Compiler temporarily disabled to avoid missing Babel plugin in this setup
    reactCompiler: false,            // React Compiler disabled (minimal, safe default)
    images: {
        remotePatterns: [
        {
                        protocol: "https",
                        hostname: "azuracast.nexitgen.de", // Ton sous-domaine AzuraCast
                        pathname: "/**",
                    },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/azura/:path*",
                destination: isProd
                                    ? "http://127.0.0.1:8080/api/:path*" // En interne sur le Gen8
                                    : "http://localhost:8080/api/:path*",
            },
        ];
    },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.externals.push("@libsql/client");
		return config;
	},
	typescript: {
		ignoreBuildErrors: true,
	}
};

export default nextConfig;

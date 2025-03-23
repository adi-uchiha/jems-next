import type { NextConfig } from "next";
// const withBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.externals.push("@libsql/client");
		// config.plugins.push(new withBundleAnalyzer({
		// 	analyzerPort: 3001,
		// }));
		// config.cache = {
		// 	type: 'filesystem',
		// 	profile: true, // Logs caching details
		// };
		return config;
	},
	typescript: {
		ignoreBuildErrors: true,
	}
};

export default nextConfig;

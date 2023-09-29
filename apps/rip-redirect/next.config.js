/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/:path*',
				destination: 'https://tts.monster/?from=solrock',
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;

// get all file names from ./i18n
const fs = require('fs');
const path = require('path');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const locales = fs.readdirSync(path.resolve('./i18n')).map((fileName) => fileName.replace(/\.json$/, ''));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		locales,
		defaultLocale: 'en-US',
	},
	images: {
		domains: ['static-cdn.jtvnw.net', 'cdn.7tv.app'],
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.plugins = [...config.plugins, new PrismaPlugin()];
		}

		return config;
	},
};

module.exports = nextConfig;

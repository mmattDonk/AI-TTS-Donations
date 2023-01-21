// get all file names from ./i18n
const fs = require('fs');
const path = require('path');

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
};

module.exports = nextConfig;

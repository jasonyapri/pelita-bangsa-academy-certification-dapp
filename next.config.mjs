/** @type {import('next').NextConfig} */
const config = {
    // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default config;

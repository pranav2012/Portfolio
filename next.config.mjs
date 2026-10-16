import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    turbopack: { root: dirname },
    images: {
        localPatterns: [{ pathname: '/api/media/file/**' }]
    },
    async redirects() {
        return [{ source: '/posts', destination: '/blog', permanent: true }];
    }
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

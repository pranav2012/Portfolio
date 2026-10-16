import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // pnpm keeps packages in the workspace root's node_modules.
    turbopack: { root: path.resolve(dirname, '..') },
    async redirects() {
        // The public site is static and lives elsewhere; this app is the editor.
        return [{ source: '/', destination: '/admin', permanent: false }];
    }
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

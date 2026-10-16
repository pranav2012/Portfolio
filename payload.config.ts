import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Users } from './src/payload/collections/Users';
import { Media } from './src/payload/collections/Media';
import { Projects } from './src/payload/collections/Projects';
import { Posts } from './src/payload/collections/Posts';
import { Profile } from './src/payload/globals/Profile';
import { Site } from './src/payload/globals/Site';
import { seed } from './src/payload/seed';
import { migrations } from './src/migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: dirname
        },
        meta: {
            titleSuffix: ' - Portfolio CMS'
        }
    },
    collections: [Projects, Posts, Media, Users],
    globals: [Profile, Site],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
        outputFile: path.resolve(dirname, 'src/payload/payload-types.ts')
    },
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URL || 'file:./data/portfolio.db'
        },
        prodMigrations: migrations
    }),
    sharp,
    graphQL: {
        disable: true
    },
    onInit: seed
});

import path from 'path';
import type { CollectionConfig } from 'payload';
import { anyone, loggedIn } from '../access';

export const Media: CollectionConfig = {
    slug: 'media',
    access: {
        read: anyone,
        create: loggedIn,
        update: loggedIn,
        delete: loggedIn
    },
    admin: {
        group: 'Content'
    },
    upload: {
        staticDir: path.resolve(process.env.MEDIA_DIR || 'data/media'),
        // Images, plus PDFs for the resume.
        mimeTypes: ['image/*', 'application/pdf'],
        imageSizes: [{ name: 'card', width: 800 }],
        adminThumbnail: 'card'
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true
        }
    ]
};

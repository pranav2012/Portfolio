import type { GlobalConfig } from 'payload';
import { anyone } from '../access';

export const Site: GlobalConfig = {
    slug: 'site',
    label: 'SEO & site',
    access: { read: anyone },
    admin: { group: 'Site' },
    fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
            name: 'ogImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Link preview image'
        },
        {
            name: 'twitterHandle',
            type: 'text',
            admin: { placeholder: '@handle' }
        },
        {
            name: 'analyticsId',
            type: 'text',
            label: 'Google Analytics ID',
            admin: { placeholder: 'G-XXXXXXX' }
        }
    ]
};

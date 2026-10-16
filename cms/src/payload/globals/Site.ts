import type { GlobalConfig } from 'payload';
import { anyone } from '../access';
import { publishAfterGlobalChange } from '../publish';

export const Site: GlobalConfig = {
    slug: 'site',
    label: 'SEO & site',
    access: { read: anyone },
    hooks: { afterChange: [publishAfterGlobalChange] },
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

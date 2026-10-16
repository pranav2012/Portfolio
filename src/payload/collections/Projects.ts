import type { CollectionConfig } from 'payload';
import { anyone, loggedIn } from '../access';
import { slugField } from '../fields/slug';

export const Projects: CollectionConfig = {
    slug: 'projects',
    access: {
        read: anyone,
        create: loggedIn,
        update: loggedIn,
        delete: loggedIn
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'section', 'order', 'year'],
        group: 'Content',
        description: 'Everything shown on the Work page.'
    },
    defaultSort: 'order',
    fields: [
        { name: 'title', type: 'text', required: true },
        slugField,
        {
            name: 'section',
            type: 'select',
            required: true,
            defaultValue: 'featured',
            options: [
                { label: 'Featured', value: 'featured' },
                { label: 'Open source & tools', value: 'oss' },
                { label: 'Earlier work', value: 'archive' }
            ],
            admin: { position: 'sidebar' }
        },
        {
            name: 'showOnHome',
            type: 'checkbox',
            label: 'Show on home page',
            admin: { position: 'sidebar' }
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 100,
            admin: {
                position: 'sidebar',
                description: 'Lower numbers come first.'
            }
        },
        {
            name: 'summary',
            type: 'textarea',
            required: true,
            admin: { description: 'One or two lines shown on the card.' }
        },
        { name: 'thumbnail', type: 'upload', relationTo: 'media' },
        {
            name: 'url',
            type: 'text',
            label: 'Main link',
            admin: { description: 'Where the card links to.' }
        },
        {
            name: 'links',
            type: 'array',
            label: 'Other links',
            fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true }
            ]
        },
        { name: 'year', type: 'text' },
        {
            name: 'stack',
            type: 'text',
            hasMany: true,
            admin: { description: 'Technologies, shown as tags.' }
        }
    ]
};

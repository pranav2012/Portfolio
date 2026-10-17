import type { CollectionConfig } from 'payload';
import { anyone, loggedIn } from '../access';
import { publishAfterChange, publishAfterDelete } from '../publish';

export const Community: CollectionConfig = {
    slug: 'community',
    labels: { singular: 'Community entry', plural: 'Community' },
    access: {
        read: anyone,
        create: loggedIn,
        update: loggedIn,
        delete: loggedIn
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'kind', 'role', 'period', 'order'],
        group: 'Content',
        description:
            'Communities led, talks given, and hackathons mentored or judged, for the Community page.'
    },
    defaultSort: 'order',
    hooks: {
        afterChange: [publishAfterChange],
        afterDelete: [publishAfterDelete]
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            admin: {
                description:
                    "The community's name, or the talk's title."
            }
        },
        {
            name: 'kind',
            type: 'select',
            required: true,
            defaultValue: 'community',
            options: [
                { label: 'Community', value: 'community' },
                { label: 'Talk', value: 'talk' },
                { label: 'Mentoring & judging', value: 'mentoring' }
            ],
            admin: { position: 'sidebar' }
        },
        {
            name: 'organisation',
            type: 'text',
            admin: {
                description:
                    'Where it happened, e.g. the meetup or hackathon. Leave empty when the title says it.'
            }
        },
        { name: 'role', type: 'text', admin: { description: 'e.g. Founder, Lead, Speaker, Mentor.' } },
        { name: 'period', type: 'text', admin: { description: 'e.g. "Dec 2022 – present" or "2023".' } },
        { name: 'description', type: 'textarea' },
        {
            name: 'highlights',
            type: 'text',
            hasMany: true,
            admin: { description: 'Short facts shown as chips, e.g. "1,000+ students".' }
        },
        { name: 'url', type: 'text', admin: { description: 'Where the entry links to.' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
            name: 'order',
            type: 'number',
            defaultValue: 100,
            admin: {
                position: 'sidebar',
                description: 'Lower numbers come first within each kind.'
            }
        }
    ]
};

import type { CollectionConfig } from 'payload';
import { anyone, loggedIn } from '../access';
import { publishAfterChange, publishAfterDelete } from '../publish';

const youtubeId = (url: string) =>
    url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1];

export const Videos: CollectionConfig = {
    slug: 'videos',
    access: {
        read: anyone,
        create: loggedIn,
        update: loggedIn,
        delete: loggedIn
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'publishedAt', 'order'],
        group: 'Content',
        description: 'YouTube videos shown in the Videos section.'
    },
    defaultSort: 'order',
    hooks: {
        afterChange: [publishAfterChange],
        afterDelete: [publishAfterDelete]
    },
    fields: [
        { name: 'title', type: 'text', required: true },
        {
            name: 'url',
            type: 'text',
            label: 'YouTube link',
            required: true,
            validate: (value: string | null | undefined) =>
                value && youtubeId(value) ? true : 'Paste a YouTube video link'
        },
        {
            name: 'youtubeId',
            type: 'text',
            admin: { hidden: true },
            hooks: {
                beforeChange: [
                    ({ siblingData }) => youtubeId(siblingData.url ?? '')
                ]
            }
        },
        {
            name: 'description',
            type: 'textarea',
            admin: { description: 'One line under the title.' }
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayOnly' }
            }
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
            name: 'thumbnail',
            type: 'upload',
            relationTo: 'media',
            admin: {
                position: 'sidebar',
                description: "Optional. YouTube's thumbnail is used otherwise."
            }
        }
    ]
};

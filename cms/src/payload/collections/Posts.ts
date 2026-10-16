import type { Access, CollectionConfig } from 'payload';
import { loggedIn } from '../access';
import { slugField } from '../fields/slug';
import { htmlOf } from '../fields/html';
import { publishAfterChange, publishAfterDelete } from '../publish';

const publishedOrLoggedIn: Access = ({ req: { user } }) =>
    user ? true : { _status: { equals: 'published' } };

export const Posts: CollectionConfig = {
    slug: 'posts',
    access: {
        read: publishedOrLoggedIn,
        create: loggedIn,
        update: loggedIn,
        delete: loggedIn
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'publishedAt', '_status'],
        group: 'Content',
        description: 'Blog posts. Save as draft until you publish.'
    },
    defaultSort: '-publishedAt',
    hooks: {
        afterChange: [publishAfterChange],
        afterDelete: [publishAfterDelete]
    },
    versions: {
        drafts: true
    },
    fields: [
        { name: 'title', type: 'text', required: true },
        slugField,
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayOnly' }
            },
            hooks: {
                beforeChange: [
                    ({ value, siblingData }) =>
                        value ||
                        (siblingData._status === 'published'
                            ? new Date().toISOString()
                            : value)
                ]
            }
        },
        {
            name: 'tags',
            type: 'text',
            hasMany: true,
            admin: { position: 'sidebar' }
        },
        {
            name: 'excerpt',
            type: 'textarea',
            admin: { description: 'Shown in the blog list and link previews.' }
        },
        { name: 'cover', type: 'upload', relationTo: 'media' },
        { name: 'content', type: 'richText', required: true },
        htmlOf('content')
    ]
};

import type { Field } from 'payload';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

// Fills itself from `title` when left empty.
export const slugField: Field = {
    name: 'slug',
    type: 'text',
    unique: true,
    index: true,
    admin: {
        position: 'sidebar',
        description: 'URL part. Leave empty to generate it from the title.'
    },
    hooks: {
        beforeValidate: [
            ({ value, data }) =>
                value
                    ? slugify(value)
                    : data?.title
                      ? slugify(data.title)
                      : value
        ]
    }
};

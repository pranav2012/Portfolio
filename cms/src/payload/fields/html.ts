import type { Field } from 'payload';
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';

// A read-only copy of a rich text field rendered to HTML, so the static
// site can use it as is. Virtual: computed on read, never stored.
export const htmlOf = (field: string): Field => ({
    name: `${field}Html`,
    type: 'textarea',
    virtual: true,
    admin: { hidden: true },
    hooks: {
        afterRead: [
            ({ siblingData }) =>
                siblingData?.[field]
                    ? convertLexicalToHTML({
                          data: siblingData[field],
                          disableContainer: true
                      })
                    : null
        ]
    }
});

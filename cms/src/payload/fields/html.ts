import type { Field } from 'payload';
import type { Media } from '../payload-types';
import { getPayloadPopulateFn } from '@payloadcms/richtext-lexical';
import {
    convertLexicalToHTMLAsync,
    type HTMLConvertersFunctionAsync
} from '@payloadcms/richtext-lexical/html-async';

const escapeHTML = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

// Code blocks become <pre data-language> for the site to highlight, and
// images become a plain <figure>. The default <picture> points its sources
// at the CMS, which the static site can't reach.
const converters: HTMLConvertersFunctionAsync = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
        Code: ({ node }) => {
            const { code = '', language = '' } = node.fields as {
                code?: string;
                language?: string;
            };
            return `<pre data-language="${escapeHTML(language)}"><code>${escapeHTML(code)}</code></pre>`;
        }
    },
    // Tables without the default inline borders; the site styles them.
    table: async ({ node, nodesToHTML }) =>
        `<table><tbody>${(await nodesToHTML({ nodes: node.children })).join('')}</tbody></table>`,
    tablerow: async ({ node, nodesToHTML }) =>
        `<tr>${(await nodesToHTML({ nodes: node.children })).join('')}</tr>`,
    tablecell: async ({ node, nodesToHTML }) => {
        const tag = node.headerState > 0 ? 'th' : 'td';
        return `<${tag}>${(await nodesToHTML({ nodes: node.children })).join('').trim()}</${tag}>`;
    },
    upload: async ({ node, populate }) => {
        const doc = (
            typeof node.value === 'object'
                ? node.value
                : await populate?.({
                      id: node.value,
                      collectionSlug: node.relationTo
                  })
        ) as Media | undefined;
        if (!doc) return '';
        const fields = (node.fields ?? {}) as { caption?: string };
        const url = escapeHTML(doc.url ?? '');
        if (!doc.mimeType?.startsWith('image'))
            return `<a href="${url}">${escapeHTML(doc.filename ?? '')}</a>`;
        const caption = fields.caption
            ? `<figcaption>${escapeHTML(fields.caption)}</figcaption>`
            : '';
        return `<figure><img src="${url}" alt="${escapeHTML(doc.alt ?? '')}" width="${doc.width ?? ''}" height="${doc.height ?? ''}" />${caption}</figure>`;
    }
});

// A read-only copy of a rich text field rendered to HTML, so the static
// site can use it as is. Virtual: computed on read, never stored.
export const htmlOf = (field: string): Field => ({
    name: `${field}Html`,
    type: 'textarea',
    virtual: true,
    admin: { hidden: true },
    hooks: {
        afterRead: [
            async ({ siblingData, req }) =>
                siblingData?.[field]
                    ? convertLexicalToHTMLAsync({
                          converters,
                          data: siblingData[field],
                          disableContainer: true,
                          populate: await getPayloadPopulateFn({
                              currentDepth: 0,
                              depth: 1,
                              req
                          })
                      })
                    : null
        ]
    }
});

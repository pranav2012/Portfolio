// Imports a Markdown post into the CMS as a draft, or updates the draft of
// the post with the same slug. Images on their own line become uploads, with
// the title as their caption; fenced code becomes code blocks; GFM tables
// become tables.
//
// Usage: pnpm payload run scripts/import-post.ts <post.md>
//   CMS_URL                default http://localhost:3200
//   PAYLOAD_ADMIN_EMAIL    an admin to sign in as
//   PAYLOAD_ADMIN_PASSWORD
//
// The Markdown starts with "# Title", then optional "> excerpt: …" and
// "> tags: a, b" and "> slug: …" lines. Image paths are relative to the Markdown file.
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
    convertMarkdownToLexical,
    editorConfigFactory
} from '@payloadcms/richtext-lexical';
import config from '../payload.config';
import type { RichTextField } from 'payload';

const CMS_URL = (process.env.CMS_URL || 'http://localhost:3200').replace(
    /\/$/,
    ''
);
const file = process.argv.at(-1);
if (!file?.endsWith('.md')) throw new Error('Pass the path to a .md file');
const dir = path.dirname(path.resolve(file));

const login = await fetch(`${CMS_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: process.env.PAYLOAD_ADMIN_EMAIL,
        password: process.env.PAYLOAD_ADMIN_PASSWORD
    })
});
if (!login.ok) throw new Error(`Signing in failed (${login.status})`);
const { token } = (await login.json()) as { token: string };
const auth = { Authorization: `JWT ${token}` };

const api = async (method: string, apiPath: string, body?: unknown) => {
    const res = await fetch(`${CMS_URL}/api${apiPath}`, {
        method,
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok)
        throw new Error(
            `${method} ${apiPath} failed (${res.status}): ${await res.text()}`
        );
    return res.json();
};

// Front matter.
let markdown = await readFile(file, 'utf8');
const title = markdown.match(/^# (.+)$/m)?.[1].trim();
if (!title) throw new Error('The post needs a "# Title" line');
const excerpt = markdown.match(/^> excerpt: (.+)$/m)?.[1].trim();
const tags = markdown
    .match(/^> tags: (.+)$/m)?.[1]
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
const slug = (markdown.match(/^> slug: (.+)$/m)?.[1].trim() ?? title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
markdown = markdown
    .replace(/^# .+\n/m, '')
    .replace(/^> (excerpt|tags|slug): .+\n/gm, '')
    .trim();

// Images: upload each (replacing an earlier upload with the same name) and
// leave a placeholder paragraph to swap for an upload node.
const images: { id: number; caption?: string }[] = [];
const imageLine = /^!\[([^\]]*)\]\((\S+?)(?: "([^"]*)")?\)$/gm;
for (const [line, alt, src, caption] of [...markdown.matchAll(imageLine)]) {
    const filename = `${slug}-${path.basename(src)}`;
    const form = new FormData();
    form.append(
        'file',
        new Blob([await readFile(path.join(dir, src))]),
        filename
    );
    form.append('_payload', JSON.stringify({ alt }));
    const { docs } = await api(
        'GET',
        `/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1`
    );
    const res = await fetch(
        `${CMS_URL}/api/media${docs[0] ? `/${docs[0].id}` : ''}`,
        { method: docs[0] ? 'PATCH' : 'POST', headers: auth, body: form }
    );
    if (!res.ok) throw new Error(`Uploading ${src} failed (${res.status})`);
    const { doc } = await res.json();
    markdown = markdown.replace(line, `IMAGE${images.length}PLACEHOLDER`);
    images.push({ id: doc.id, caption });
}

const posts = (await config).collections.find(c => c.slug === 'posts');
const editorConfig = editorConfigFactory.fromField({
    field: posts?.fields.find(
        f => 'name' in f && f.name === 'content'
    ) as RichTextField
});
const content = convertMarkdownToLexical({ editorConfig, markdown });
content.root.children = content.root.children.map(node => {
    const text =
        node.type === 'paragraph' &&
        (node as { children?: { text?: string }[] }).children?.[0]?.text;
    const index = text ? text.match(/^IMAGE(\d+)PLACEHOLDER$/)?.[1] : null;
    if (index === null || index === undefined) return node;
    const image = images[Number(index)];
    return {
        type: 'upload',
        version: 3,
        format: '',
        id: randomUUID().replaceAll('-', '').slice(0, 24),
        relationTo: 'media',
        value: image.id,
        fields: image.caption ? { caption: image.caption } : {}
    } as unknown as typeof node;
});

const data = { title, slug, excerpt, tags, content, _status: 'draft' };
const { docs } = await api(
    'GET',
    `/posts?where[slug][equals]=${slug}&draft=true&limit=1`
);
const saved = docs[0]
    ? await api('PATCH', `/posts/${docs[0].id}?draft=true`, data)
    : await api('POST', '/posts?draft=true', data);
console.log(
    `Saved draft "${title}" (${images.length} images): ${CMS_URL}/admin/collections/posts/${saved.doc.id}`
);
process.exit(0);

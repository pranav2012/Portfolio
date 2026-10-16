// Writes the site's content from the CMS into the site's source tree:
// JSON files plus the original images. The site is built only from these
// files, so it never talks to the CMS.
//
// Usage: node scripts/export-content.mjs [outDir]
//   CMS_URL  where the CMS is (default http://localhost:3200)
//   outDir   default ../web/src/content
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CMS_URL = (process.env.CMS_URL || 'http://localhost:3200').replace(
    /\/$/,
    ''
);
const out = path.resolve(process.argv[2] || '../web/src/content');
const mediaDir = path.join(out, 'media');

const get = async apiPath => {
    const res = await fetch(`${CMS_URL}/api${apiPath}`);
    if (!res.ok) throw new Error(`GET ${apiPath} failed (${res.status})`);
    return res.json();
};
const docs = async (collection, query) =>
    (await get(`/${collection}?${query}&limit=500&depth=1`)).docs;

// Bookkeeping fields that would only add noise to diffs.
const NOISE = new Set([
    'createdAt',
    'updatedAt',
    '_status',
    'thumbnailURL',
    'sizes',
    'focalX',
    'focalY',
    'filesize',
    'mimeType',
    'prefix'
]);
const used = new Set();

// Media becomes { file, alt, width, height }; the file is copied alongside.
const clean = value => {
    if (Array.isArray(value)) return value.map(clean);
    if (!value || typeof value !== 'object') return value;
    if (
        typeof value.url === 'string' &&
        value.url.startsWith('/api/media/file/')
    ) {
        const file = decodeURIComponent(value.url.split('/').pop());
        used.add(file);
        return {
            file,
            alt: value.alt ?? '',
            width: value.width,
            height: value.height
        };
    }
    return Object.fromEntries(
        Object.entries(value)
            .filter(([key]) => !NOISE.has(key))
            .map(([key, v]) => [key, clean(v)])
    );
};

// Images inside rich text: point them at the copied file.
const cleanHtml = html =>
    html?.replace(/src="\/api\/media\/file\/([^"]+)"/g, (_, file) => {
        used.add(decodeURIComponent(file));
        return `src="media:${decodeURIComponent(file)}"`;
    }) ?? null;

const content = {
    site: clean(await get('/globals/site?depth=1')),
    profile: clean(await get('/globals/profile?depth=1')),
    projects: clean(await docs('projects', 'sort=order')),
    posts: clean(
        await docs(
            'posts',
            'where[_status][equals]=published&sort=-publishedAt'
        )
    ).map(post => ({ ...post, contentHtml: cleanHtml(post.contentHtml) })),
    videos: clean(await docs('videos', 'sort=order'))
};
delete content.profile.about;
for (const post of content.posts) delete post.content;

await mkdir(mediaDir, { recursive: true });
for (const [name, data] of Object.entries(content))
    await writeFile(
        path.join(out, `${name}.json`),
        `${JSON.stringify(data, null, 4)}\n`
    );

// Copy the images in use, and drop ones that no longer are.
for (const file of used) {
    const res = await fetch(
        `${CMS_URL}/api/media/file/${encodeURIComponent(file)}`
    );
    if (!res.ok) throw new Error(`Downloading ${file} failed (${res.status})`);
    await writeFile(
        path.join(mediaDir, file),
        Buffer.from(await res.arrayBuffer())
    );
}
for (const file of await readdir(mediaDir))
    if (!used.has(file)) await rm(path.join(mediaDir, file));

console.log(`Exported content to ${out} (${used.size} images)`);

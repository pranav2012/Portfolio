import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { codeToHtml } from 'shiki';
import site from '../content/site.json';
import profile from '../content/profile.json';
import projects from '../content/projects.json';
import posts from '../content/posts.json';
import videos from '../content/videos.json';

// The site's content. The CMS writes these files (cms/scripts/
// export-content.mjs) and pushes them, which redeploys the site.

export type Media = {
    file: string;
    alt: string;
    width: number;
    height: number;
};
export type Link = { label: string; url: string };

export type Project = {
    id: number;
    title: string;
    slug: string;
    section: 'featured' | 'oss' | 'archive';
    showOnHome?: boolean | null;
    summary: string;
    thumbnail?: Media | null;
    url?: string | null;
    links?: Link[] | null;
    year?: string | null;
    stack?: string[] | null;
};

export type Post = {
    id: number;
    title: string;
    slug: string;
    publishedAt: string;
    tags?: string[] | null;
    excerpt?: string | null;
    cover?: Media | null;
    contentHtml?: string | null;
};

export type Video = {
    id: number;
    title: string;
    url: string;
    youtubeId: string;
    description?: string | null;
    publishedAt?: string | null;
    thumbnail?: Media | null;
    // Which YouTube channel it's on; unset for the main channel.
    channel?: string | null;
};

export type Job = {
    id: string;
    role: string;
    company: string;
    companyUrl?: string | null;
    location?: string | null;
    period?: string | null;
    description?: string | null;
};

export type Social = {
    id: string;
    platform: string;
    label: string;
    url: string;
};

export type Profile = {
    name: string;
    role: string;
    greeting?: string | null;
    photo?: Media | null;
    aboutHtml?: string | null;
    resumeUrl?: string | null;
    experience?: Job[] | null;
    education?:
        | { id: string; degree: string; school: string; year?: string | null }[]
        | null;
    interests?: string | null;
    socials?: Social[] | null;
};

export type Site = {
    title: string;
    description?: string | null;
    ogImage?: Media | null;
    twitterHandle?: string | null;
    analyticsId?: string | null;
};

export const getSite = () => site as Site;
export const getProfile = () => profile as Profile;
export const getProjects = () => projects as Project[];
export const getPosts = () => posts as Post[];
export const getVideos = () => videos as Video[];

const images = import.meta.glob<{ default: ImageMetadata }>(
    '../content/media/*',
    {
        eager: true
    }
);

// The image file for a piece of media, for Astro to optimise.
export const image = (media: Media | string): ImageMetadata => {
    const file = typeof media === 'string' ? media : media.file;
    const found = images[`../content/media/${file}`];
    if (!found) throw new Error(`Missing image ${file} in src/content/media`);
    return found.default;
};

export const youtubeThumbnail = (video: Video) =>
    video.thumbnail
        ? image(video.thumbnail)
        : `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

// Images inside rich text are written as src="media:<file>"; swap in
// optimised copies.
export const localiseImages = async (html: string) => {
    for (const [, file] of html.matchAll(/src="media:([^"]+)"/g)) {
        const optimised = await getImage({ src: image(file), width: 1400 });
        html = html.replaceAll(
            `src="media:${file}"`,
            `src="${optimised.src}" loading="lazy" decoding="async"`
        );
    }
    return html;
};

// Code blocks arrive as <pre data-language="…"><code>escaped</code></pre>;
// highlight them, with colours for both themes.
const languageAliases: Record<string, string> = { shell: 'bash', plaintext: 'text' };
const unescape = (value: string) =>
    value.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&');

export const highlightCode = async (html: string) => {
    const blocks = [...html.matchAll(/<pre data-language="([^"]*)"><code>([\s\S]*?)<\/code><\/pre>/g)];
    for (const [block, language, code] of blocks) {
        const highlighted = await codeToHtml(unescape(code), {
            lang: languageAliases[language] ?? (language || 'text'),
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false
        });
        html = html.replace(block, highlighted);
    }
    return html;
};

export const formatDate = (value?: string | null) =>
    value
        ? new Date(value).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC'
          })
        : '';

export const emailOf = (profile: Profile) =>
    profile.socials
        ?.find(s => s.platform === 'email')
        ?.url.replace(/^mailto:/, '');

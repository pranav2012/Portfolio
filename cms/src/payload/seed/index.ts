import path from 'path';
import type { Payload } from 'payload';
import { projects } from './projects';
import { CHANNEL_URL, videos } from './videos';
import { profile, site } from './profile';
import { paragraph, richText } from './richtext';

const imagesDir = path.resolve(process.cwd(), 'src/payload/seed/images');

// Runs on every boot. Creates the admin user from env vars (so nobody else
// can claim /admin on a fresh deploy) and fills an empty database with the
// initial content. Once anything exists it leaves the data alone.
export const seed = async (payload: Payload) => {
    const { totalDocs: users } = await payload.count({ collection: 'users' });
    const email = process.env.PAYLOAD_ADMIN_EMAIL;
    const password = process.env.PAYLOAD_ADMIN_PASSWORD;
    if (users === 0 && email && password) {
        await payload.create({
            collection: 'users',
            data: { email, password }
        });
        payload.logger.info(`Created admin user ${email}`);
    }

    // Videos came later, so they're seeded on their own.
    const { totalDocs: videoCount } = await payload.count({
        collection: 'videos'
    });
    if (videoCount === 0) {
        for (const video of videos)
            await payload.create({ collection: 'videos', data: video });
        payload.logger.info(`Seeded ${videos.length} videos`);

        // Sites seeded before videos existed also lack the channel link.
        const profile = await payload.findGlobal({ slug: 'profile' });
        const socials = profile.socials ?? [];
        if (socials.length && !socials.some(s => s.platform === 'youtube')) {
            const email = socials.findIndex(s => s.platform === 'email');
            socials.splice(email === -1 ? socials.length : email, 0, {
                platform: 'youtube',
                label: 'YouTube',
                url: CHANNEL_URL
            });
            await payload.updateGlobal({ slug: 'profile', data: { socials } });
        }
    }

    const { totalDocs: existing } = await payload.count({
        collection: 'projects'
    });
    if (existing > 0) return;

    payload.logger.info('Seeding initial content…');

    const uploads = new Map<string, number>();
    const upload = async (file: string, alt: string) => {
        if (!uploads.has(file)) {
            const doc = await payload.create({
                collection: 'media',
                data: { alt },
                filePath: path.join(imagesDir, file)
            });
            uploads.set(file, doc.id as number);
        }
        return uploads.get(file);
    };

    for (const { thumbnail, ...project } of projects) {
        await payload.create({
            collection: 'projects',
            data: {
                ...project,
                thumbnail: thumbnail
                    ? await upload(thumbnail, project.title)
                    : undefined
            }
        });
    }

    await payload.updateGlobal({
        slug: 'profile',
        data: {
            ...profile,
            photo: await upload('pranav.jpeg', profile.name)
        }
    });

    await payload.updateGlobal({
        slug: 'site',
        data: {
            ...site,
            ogImage: await upload('og-card.png', site.title)
        }
    });

    await payload.create({
        collection: 'posts',
        draft: true,
        data: {
            title: 'Hello, world (again)',
            excerpt:
                'An example draft. Edit it, or delete it and write your own.',
            tags: ['meta'],
            content: richText(
                paragraph(
                    'This is a draft, so only you can see it. Write in the editor, add images and links, then hit ',
                    { text: 'Publish', bold: true },
                    ' and it shows up on /blog straight away.'
                )
            ),
            _status: 'draft'
        }
    });

    payload.logger.info('Seeded initial content');
};

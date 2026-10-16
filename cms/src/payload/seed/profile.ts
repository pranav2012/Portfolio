import { CHANNEL_URL } from './videos';
import { paragraph, richText } from './richtext';

export const profile = {
    name: 'Pranav Agarwal',
    role: 'Senior Software Engineer',
    greeting:
        'Hello, I’m a frontend engineer from India building for web, mobile and AI tooling!',
    about: richText(
        paragraph(
            'I’m a senior frontend engineer at ',
            { text: 'Headout', url: 'https://www.headout.com' },
            ', where I work on micro-frontends, payments and AI-integrated developer tooling. I care about fast, native-feeling interfaces on the web and on mobile.'
        ),
        paragraph(
            'Outside work I build things I want to use myself: ',
            { text: 'NomadSafe', url: 'https://nomadsafe.pranav-agarwal.com' },
            ', a travel companion app, and ',
            { text: 'grain', url: 'https://grain.pranav-agarwal.com' },
            ', a tool for reviewing pull requests as user flows. Most days that means React, Next.js, React Native and TypeScript, with some Rust and Go when the problem asks for it.'
        )
    ),
    resumeUrl:
        'https://drive.google.com/file/d/1mqQDhM_wICCdKI6l2iQjvjnPNqqKqbio/view',
    experience: [
        {
            role: 'Senior Software Engineer',
            company: 'Headout',
            companyUrl: 'https://www.headout.com',
            location: 'Bangalore, India · Remote',
            period: 'Jan 2022 – Present',
            description:
                'Micro-frontends, payments and AI-integrated developer tooling.'
        },
        {
            role: 'Software Engineering Intern',
            company: 'American Express',
            companyUrl: 'https://www.americanexpress.com',
            location: 'Gurugram, India',
            period: 'Jul 2022'
        },
        {
            role: 'Freelance Frontend Developer',
            company: 'Moyyn',
            location: 'Berlin, Germany · Remote',
            period: 'Nov 2020 – May 2021'
        }
    ],
    education: [
        {
            degree: 'B.Tech, Computer Science & Engineering',
            school: 'Manav Rachna International Institute of Research and Studies',
            year: '2023'
        }
    ],
    interests:
        'Frontend performance, AI-native developer tools, design, and travel',
    socials: [
        {
            platform: 'github' as const,
            label: 'GitHub',
            url: 'https://github.com/pranav2012'
        },
        {
            platform: 'x' as const,
            label: 'X',
            url: 'https://x.com/pranav__agr'
        },
        {
            platform: 'linkedin' as const,
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/in/pranav-agarwal-579363166'
        },
        {
            platform: 'youtube' as const,
            label: 'YouTube',
            url: CHANNEL_URL
        },
        {
            platform: 'email' as const,
            label: 'Email',
            url: 'mailto:p2012agarwal@gmail.com'
        }
    ]
};

export const site = {
    title: 'Pranav Agarwal',
    description:
        'Pranav Agarwal, senior frontend engineer at Headout. Projects, writing and experiments across web, mobile and AI tooling.',
    twitterHandle: '@pranav__agr',
    analyticsId: 'G-D1FQW8B99F'
};

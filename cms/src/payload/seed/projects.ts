type SeedProject = {
    title: string;
    section: 'featured' | 'oss' | 'archive';
    order: number;
    showOnHome?: boolean;
    summary: string;
    thumbnail?: string;
    url?: string;
    links?: { label: string; url: string }[];
    year?: string;
    stack?: string[];
};

export const projects: SeedProject[] = [
    {
        title: 'grain',
        section: 'featured',
        order: 10,
        showOnHome: true,
        summary:
            'Review pull requests as user flows, not file lists. Changes are grouped by the screen they run on, in call order, with go-to-definition and optional AI explanations from your own coding agent. Runs locally through your gh login.',
        thumbnail: 'grain.png',
        url: 'https://grain.pranav-agarwal.com',
        links: [
            { label: 'GitHub', url: 'https://github.com/pranav2012/grain' },
            { label: 'npm', url: 'https://www.npmjs.com/package/grain-ci' }
        ],
        year: '2026',
        stack: ['Rust', 'TypeScript', 'GitHub API']
    },
    {
        title: 'NomadSafe',
        section: 'featured',
        order: 20,
        showOnHome: true,
        summary:
            'An offline-first travel companion: trip replays with your best photos, day-by-day plans, fair expense splits, SOS and live location for trusted contacts, and an on-device AI travel assistant.',
        thumbnail: 'nomadsafe.png',
        url: 'https://nomadsafe.pranav-agarwal.com',
        year: '2026',
        stack: ['React Native', 'Expo', 'Convex', 'On-device LLM']
    },
    {
        title: 'react-native-liquid-tabs',
        section: 'featured',
        order: 30,
        summary:
            'The iOS 26 Liquid Glass tab bar for Android: a refracting, draggable droplet lens over a real blur at 120 Hz. Native tabs on iOS, one API for both.',
        thumbnail: 'liquid-tabs.png',
        url: 'https://www.npmjs.com/package/react-native-liquid-tabs',
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/pranav2012/react-native-liquid-tabs'
            }
        ],
        year: '2026',
        stack: ['React Native', 'Skia', 'Reanimated']
    },
    {
        title: 'Skia GPU memory investigation',
        section: 'oss',
        order: 40,
        summary:
            'A minimal repro and measurements of GPU memory growth in react-native-skia v3 on Android, with raw data across devices and upstream patch drafts.',
        url: 'https://github.com/pranav2012/skia-memory-repro',
        year: '2026',
        stack: ['React Native', 'Skia', 'Android']
    },
    {
        title: 'claude-statusline-pro',
        section: 'oss',
        order: 50,
        summary:
            'A compact statusline for Claude Code: model, tokens, cost, context window and usage limits at a glance. One npx command to install.',
        url: 'https://github.com/pranav2012/claude-statusline-pro',
        links: [
            {
                label: 'npm',
                url: 'https://www.npmjs.com/package/@pranav2012/claude-statusline-pro'
            }
        ],
        year: '2026',
        stack: ['Shell', 'Claude Code']
    },
    {
        title: 'ABTestify',
        section: 'oss',
        order: 60,
        summary:
            'A small npm package for deterministic A/B test bucketing in JavaScript apps, with exposure and split control.',
        url: 'https://www.npmjs.com/package/abtestify',
        links: [
            { label: 'GitHub', url: 'https://github.com/pranav2012/abtestify' }
        ],
        year: '2024',
        stack: ['TypeScript', 'npm']
    },
    {
        title: 'Moyyn',
        section: 'archive',
        order: 70,
        summary:
            'An AI-based reverse job search platform for a Berlin startup. Freelance frontend work.',
        thumbnail: 'moyyn.png',
        year: '2021',
        stack: ['React']
    },
    {
        title: 'Open KYC',
        section: 'archive',
        order: 80,
        summary:
            'A blockchain-based dApp that removes repeated e-KYC across banks. Built at the American Express hackathon.',
        thumbnail: 'open-kyc.jpg',
        url: 'https://github.com/pranav2012/AmexHack',
        year: '2021',
        stack: ['Blockchain', 'Open Banking']
    }
];

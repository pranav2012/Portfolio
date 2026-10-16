import snapshot from '../content/contributions.json';

// An allowlist, so personal and work repositories never appear.
const AUTHOR = 'pranav2012';
const REPOS = ['wcandillon/react-native-skia', 'thedevdojo/tails-components'];

export type Contribution = {
    repo: string;
    url: string;
    description: string | null;
    stars: number;
    language: string | null;
    avatar: string;
    prs: { number: number; title: string; url: string; mergedAt: string }[];
};

const github = async <T>(path: string): Promise<T> => {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/${path}`, {
        headers: {
            accept: 'application/vnd.github+json',
            'user-agent': 'pranav-agarwal.com',
            ...(token ? { authorization: `Bearer ${token}` } : {})
        },
        signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
    return res.json() as Promise<T>;
};

type SearchItem = {
    number: number;
    title: string;
    html_url: string;
    repository_url: string;
    pull_request: { merged_at: string | null };
};
type Repo = {
    html_url: string;
    description: string | null;
    stargazers_count: number;
    language: string | null;
    owner: { avatar_url: string };
};

const fetchContributions = async (): Promise<Contribution[]> => {
    const query = encodeURIComponent(`is:pr is:merged author:${AUTHOR} ${REPOS.map(r => `repo:${r}`).join(' ')}`);
    const [{ items }, repos] = await Promise.all([
        github<{ items: SearchItem[] }>(`search/issues?per_page=100&q=${query}`),
        Promise.all(REPOS.map(r => github<Repo>(`repos/${r}`)))
    ]);
    return REPOS.map((repo, i) => ({
        repo,
        url: repos[i].html_url,
        description: repos[i].description,
        stars: repos[i].stargazers_count,
        language: repos[i].language,
        avatar: repos[i].owner.avatar_url,
        prs: items
            .filter(item => item.repository_url.endsWith(`/repos/${repo}`) && item.pull_request.merged_at)
            .map(item => ({ number: item.number, title: item.title, url: item.html_url, mergedAt: item.pull_request.merged_at! }))
            .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))
    })).filter(c => c.prs.length > 0);
};

let cached: Promise<Contribution[]> | undefined;

// Live from GitHub, or the committed snapshot if GitHub can't be reached.
export const getContributions = () =>
    (cached ??= fetchContributions().catch(error => {
        console.warn(`[contributions] using the saved snapshot: ${error.message}`);
        return snapshot as Contribution[];
    }));

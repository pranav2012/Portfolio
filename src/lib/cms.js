import { getPayload } from 'payload';
import config from '@payload-config';

export const getCMS = () => getPayload({ config });

// getServerSideProps can't serialise `undefined` or Dates.
const plain = value => JSON.parse(JSON.stringify(value ?? null));

// Data every page needs for the layout (meta tags, navbar).
export async function getLayoutProps(cms) {
    const [site, profile] = await Promise.all([
        cms.findGlobal({ slug: 'site', depth: 1 }),
        cms.findGlobal({ slug: 'profile', depth: 0 })
    ]);
    return plain({ site: { ...site, name: profile.name } });
}

export async function withLayout(getProps) {
    const cms = await getCMS();
    const [layout, props] = await Promise.all([
        getLayoutProps(cms),
        getProps(cms)
    ]);
    if (props?.notFound) return props;
    return { props: { ...layout, ...plain(props) } };
}

import Head from 'next/head';
import dynamic from 'next/dynamic';
import NavBar from 'Components/navbar';
import { Box, Container } from '@chakra-ui/react';
import Footer from 'Components/footer';
import VoxelLoader from 'Elements/voxel-loader';

const LazyVoxelPranav = dynamic(() => import('Components/voxel-pranav'), {
    ssr: false,
    loading: () => <VoxelLoader />
});

const Main = ({ children, router, site = {} }) => {
    const name = site.name || 'Pranav Agarwal';
    const ogImage = site.ogImage?.url || '/images/card.png';
    return (
        <Box as="main" pb={8}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                {site.description && (
                    <meta name="description" content={site.description} />
                )}
                <meta name="author" content={name} />
                <link
                    rel="apple-touch-icon"
                    href="/favicon/apple-touch-icon.png"
                />
                <link
                    rel="shortcut icon"
                    href="/favicon/favicon.ico"
                    type="image/x-icon"
                />
                <meta name="twitter:card" content="summary_large_image" />
                {site.twitterHandle && (
                    <>
                        <meta
                            name="twitter:site"
                            content={site.twitterHandle}
                        />
                        <meta
                            name="twitter:creator"
                            content={site.twitterHandle}
                        />
                    </>
                )}
                <meta name="twitter:image" content={ogImage} />
                <meta property="og:site_name" content={site.title || name} />
                <meta property="og:type" content="website" key="og:type" />
                <meta property="og:image" content={ogImage} key="og:image" />
                <title>{site.title || name}</title>
            </Head>

            <NavBar path={router.asPath} name={name} />

            <Container maxW="3xl" pt={14}>
                <LazyVoxelPranav />

                {children}

                <Footer name={name} />
            </Container>
        </Box>
    );
};

export default Main;

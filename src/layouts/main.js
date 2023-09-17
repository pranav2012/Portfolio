import Head from 'next/head';
import dynamic from 'next/dynamic';
import NavBar from 'Components/navbar';
import { Box, Container } from '@chakra-ui/react';
import Footer from 'Components/footer';
import VoxelDogLoader from 'Elements/voxel-dog-loader';

const LazyVoxelDog = dynamic(() => import('Components/voxel-dog'), {
    ssr: false,
    loading: () => <VoxelDogLoader />
});

const Main = ({ children, router }) => {
    return (
        <Box as="main" pb={8}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="description" content="Pranav's Portfolio" />
                <meta name="author" content="Pranav Agarwal" />
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
                <meta name="twitter:site" content="@Pranav__agr" />
                <meta name="twitter:creator" content="@Pranav__agr" />
                <meta name="twitter:image" content="/images/card.png" />
                <meta
                    property="og:site_name"
                    content="Pranav Agarwal's Portfolio"
                />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/card.png" />
                <title>Pranav Agarwal - Homepage</title>
            </Head>

            <NavBar path={router.asPath} />

            <Container maxW="container.md" pt={14}>
                <LazyVoxelDog />

                {children}

                <Footer />
            </Container>
        </Box>
    );
};

export default Main;

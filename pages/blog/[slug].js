import NextLink from 'next/link';
import Head from 'next/head';
import {
    Box,
    Container,
    Heading,
    HStack,
    Badge,
    Link,
    Text
} from '@chakra-ui/react';
import { IoChevronForward } from 'react-icons/io5';
import Layout from 'Layouts/article';
import RichText from 'Elements/rich-text';
import { Thumbnail, formatDate } from 'Elements/grid-item';
import { withLayout } from 'Lib/cms';
import { mediaUrl } from 'Lib/media';

const Post = ({ post }) => (
    <Layout title={post.title}>
        <Head>
            {post.excerpt && (
                <>
                    <meta name="description" content={post.excerpt} />
                    <meta property="og:description" content={post.excerpt} />
                </>
            )}
            {mediaUrl(post.cover) && (
                <meta property="og:image" content={mediaUrl(post.cover)} />
            )}
            <meta property="og:type" content="article" />
        </Head>
        <Container>
            <Box mb={4}>
                <Link asChild>
                    <NextLink href="/blog">Blog</NextLink>
                </Link>
                <span>
                    {' '}
                    <IoChevronForward style={{ display: 'inline' }} />{' '}
                </span>
            </Box>
            <Heading as="h1" size="2xl" mb={2}>
                {post.title}
            </Heading>
            <HStack gap={2} mb={6} wrap="wrap">
                <Text fontSize="sm" opacity={0.6}>
                    {formatDate(post.publishedAt)}
                </Text>
                {post.tags?.map(tag => (
                    <Badge key={tag} colorPalette="teal" variant="subtle">
                        {tag}
                    </Badge>
                ))}
            </HStack>
            {post.cover && (
                <Box mb={6}>
                    <Thumbnail media={post.cover} title={post.title} />
                </Box>
            )}
            <RichText data={post.content} />
        </Container>
    </Layout>
);

export const getServerSideProps = ({ params }) =>
    withLayout(async cms => {
        const { docs } = await cms.find({
            collection: 'posts',
            where: {
                slug: { equals: params.slug },
                _status: { equals: 'published' }
            },
            limit: 1,
            depth: 1
        });
        return docs[0] ? { post: docs[0] } : { notFound: true };
    });

export default Post;

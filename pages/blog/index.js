import { Container, Heading, Stack, Text } from '@chakra-ui/react';
import Layout from 'Layouts/article';
import Section from 'Elements/section';
import { PostItem } from 'Elements/grid-item';
import { withLayout } from 'Lib/cms';

const Blog = ({ posts }) => (
    <Layout title="Blog">
        <Container>
            <Heading as="h3" fontSize={20} mb={4}>
                Blog
            </Heading>
            <Section delay={0.1}>
                {posts.length === 0 ? (
                    <Text opacity={0.7}>First posts are on the way.</Text>
                ) : (
                    <Stack gap={4}>
                        {posts.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </Stack>
                )}
            </Section>
        </Container>
    </Layout>
);

export const getServerSideProps = () =>
    withLayout(async cms => {
        const { docs } = await cms.find({
            collection: 'posts',
            where: { _status: { equals: 'published' } },
            sort: '-publishedAt',
            limit: 100,
            depth: 0,
            select: {
                title: true,
                slug: true,
                excerpt: true,
                publishedAt: true
            }
        });
        return { posts: docs };
    });

export default Blog;

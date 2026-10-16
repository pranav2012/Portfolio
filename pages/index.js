import NextLink from 'next/link';
import {
    Container,
    Heading,
    Box,
    Image,
    SimpleGrid,
    Button,
    Text,
    Link,
    Stack
} from '@chakra-ui/react';
import { BioSection, BioYear } from 'Elements/bio';
import Layout from 'Layouts/article';
import Section from 'Elements/section';
import RichText from 'Elements/rich-text';
import SocialIcon from 'Elements/social-icon';
import { WorkGridItem, PostItem } from 'Elements/grid-item';
import { IoChevronForward } from 'react-icons/io5';
import { withLayout } from 'Lib/cms';
import { mediaUrl } from 'Lib/media';

const accent = { base: '#65b1b0', _dark: '#85d8e3' };

const Home = ({ profile, projects, posts }) => (
    <Layout>
        <Container>
            {profile.greeting && (
                <Box
                    borderRadius="lg"
                    mb={6}
                    p={3}
                    textAlign="center"
                    bg={{ base: 'whiteAlpha.500', _dark: 'whiteAlpha.200' }}
                >
                    {profile.greeting}
                </Box>
            )}

            <Box display={{ md: 'flex' }}>
                <Box flexGrow={1}>
                    <Heading as="h2" size="3xl">
                        {profile.name}
                    </Heading>
                    <p>{profile.role}</p>
                </Box>
                {mediaUrl(profile.photo) && (
                    <Box
                        flexShrink={0}
                        mt={{ base: 4, md: 0 }}
                        ml={{ md: 6 }}
                        textAlign="center"
                    >
                        <Image
                            borderColor="whiteAlpha.800"
                            borderWidth={2}
                            borderStyle="solid"
                            maxWidth="100px"
                            display="inline-block"
                            borderRadius="full"
                            src={mediaUrl(profile.photo)}
                            alt={profile.photo.alt || profile.name}
                        />
                    </Box>
                )}
            </Box>

            <Section delay={0.1}>
                <Heading as="h3" variant="section-title">
                    About Me
                </Heading>
                <RichText data={profile.about} textAlign="justify" />
                {profile.resumeUrl && (
                    <Box textAlign="center" my={4}>
                        <Button asChild colorPalette="teal">
                            <a
                                href={profile.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                My Resume <IoChevronForward />
                            </a>
                        </Button>
                    </Box>
                )}
            </Section>

            {profile.experience?.length > 0 && (
                <Section delay={0.2}>
                    <Heading as="h3" variant="section-title">
                        Experience
                    </Heading>
                    <Stack gap={3}>
                        {profile.experience.map(job => (
                            <BioSection key={job.id}>
                                <Text fontWeight="semibold">
                                    {job.role} at{' '}
                                    {job.companyUrl ? (
                                        <Link
                                            href={job.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {job.company}
                                        </Link>
                                    ) : (
                                        job.company
                                    )}
                                </Text>
                                <BioYear color={accent}>
                                    {[job.location, job.period]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </BioYear>
                                {job.description && (
                                    <Text fontSize="sm" mt={1}>
                                        {job.description}
                                    </Text>
                                )}
                            </BioSection>
                        ))}
                    </Stack>
                </Section>
            )}

            {profile.education?.length > 0 && (
                <Section delay={0.2}>
                    <Heading as="h3" variant="section-title">
                        Education
                    </Heading>
                    {profile.education.map(item => (
                        <BioSection key={item.id}>
                            {item.degree}, {item.school}
                            {item.year && (
                                <BioYear color={accent}> ({item.year})</BioYear>
                            )}
                        </BioSection>
                    ))}
                </Section>
            )}

            {projects.length > 0 && (
                <Section delay={0.3}>
                    <Heading as="h3" variant="section-title">
                        Recent Work
                    </Heading>
                    <SimpleGrid columns={[1, 2, 2]} gap={6}>
                        {projects.map(project => (
                            <WorkGridItem key={project.id} project={project} />
                        ))}
                    </SimpleGrid>
                    <Box textAlign="center" my={4}>
                        <Button asChild colorPalette="teal">
                            <NextLink href="/works">
                                All my work <IoChevronForward />
                            </NextLink>
                        </Button>
                    </Box>
                </Section>
            )}

            {posts.length > 0 && (
                <Section delay={0.3}>
                    <Heading as="h3" variant="section-title">
                        Latest Writing
                    </Heading>
                    <Stack gap={3}>
                        {posts.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </Stack>
                </Section>
            )}

            {profile.interests && (
                <Section delay={0.3}>
                    <Heading as="h3" variant="section-title">
                        I <span style={{ color: 'red' }}>♥</span>
                    </Heading>
                    <p>{profile.interests}</p>
                </Section>
            )}

            {profile.socials?.length > 0 && (
                <Section delay={0.3}>
                    <Heading as="h3" variant="section-title">
                        Let&apos;s Connect
                    </Heading>
                    <SimpleGrid columns={[2, 4, 4]} gap={2} marginTop={2}>
                        {profile.socials.map(social => (
                            <Box key={social.id}>
                                <Button
                                    asChild
                                    variant="ghost"
                                    colorPalette="teal"
                                >
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <SocialIcon
                                            platform={social.platform}
                                        />{' '}
                                        {social.label}
                                    </a>
                                </Button>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Section>
            )}
        </Container>
    </Layout>
);

export const getServerSideProps = () =>
    withLayout(async cms => {
        const [profile, projects, posts] = await Promise.all([
            cms.findGlobal({ slug: 'profile', depth: 1 }),
            cms.find({
                collection: 'projects',
                where: { showOnHome: { equals: true } },
                sort: 'order',
                limit: 4,
                depth: 1
            }),
            cms.find({
                collection: 'posts',
                where: { _status: { equals: 'published' } },
                sort: '-publishedAt',
                limit: 3,
                depth: 0,
                select: {
                    title: true,
                    slug: true,
                    excerpt: true,
                    publishedAt: true
                }
            })
        ]);
        return { profile, projects: projects.docs, posts: posts.docs };
    });

export default Home;

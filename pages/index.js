import NextLink from 'next/link';
import {
    Link,
    Container,
    Heading,
    Box,
    Image,
    SimpleGrid,
    Button,
    List,
    ListItem,
    Icon,
    useColorModeValue
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Paragraph from '../components/paragraph';
import { BioSection, BioYear } from '../components/bio';
import Layout from '../components/layouts/article';
import Section from '../components/section';
import { GridItem } from '../components/grid-item';
import {
    IoLogoTwitter,
    IoLogoLinkedin,
    IoMail,
    IoLogoGithub
} from 'react-icons/io5';
import thumbYouTube from '../public/images/links/youtube.png';
import thumbInkdrop from '../public/images/works/moyyn.png';

const Home = () => (
    <Layout>
        <Container>
            <Box
                borderRadius="lg"
                mb={6}
                p={3}
                textAlign="center"
                bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            >
                Hello, I&apos;m a full-stack developer based in India!
            </Box>

            <Box display={{ md: 'flex' }}>
                <Box flexGrow={1}>
                    <Heading as="h2" variant="page-title">
                        Pranav Agarwal
                    </Heading>
                    <p>Engineering Craftsman ( Developer )</p>
                </Box>
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
                        src="/images/pranav.jpg"
                        alt="Profile image"
                    />
                </Box>
            </Box>

            <Section delay={0.1}>
                <Heading as="h3" variant="section-title">
                    Work
                </Heading>
                <Paragraph>
                    Pranav is a freelance and a full-stack developer based in
                    Delhi with a passion for building Applications using
                    React.js / Next.js, and Flutter. Working on technologies
                    like Node.Js, Flask, AWS, Digital Ocean, GCP and Devops.
                    Have built scalable products which is currently being used
                    by 500+ users daily
                    <NextLink href="/works/moyyn">
                        <Link> Moyyn</Link>
                    </NextLink>
                    .
                </Paragraph>
                <Box align="center" my={4}>
                    <a
                        href="https://docs.google.com/document/d/1j-BclNZWvvoZ52XAADE7PMx0U7S0ubLqfPXv3_9RsSA"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            rightIcon={<ChevronRightIcon />}
                            colorScheme="teal"
                        >
                            My Resume
                        </Button>
                    </a>
                </Box>
            </Section>

            <Section delay={0.2}>
                <Heading as="h3" variant="section-title">
                    Bio
                </Heading>
                <BioSection>
                    <BioYear>2001</BioYear>
                    Born in Delhi, India.
                </BioSection>
                <BioSection>
                    <BioYear>2023 Expected</BioYear>
                    Graduate from a Bachelor&apos;s Program in the Computer
                    Science and Engineering at Manav Rachna International
                    Institute of Research and Studies
                </BioSection>
                <BioSection>
                    <BioYear>2020</BioYear>
                    Worked as an Software Intern at Moyyn! Berlin, Germany
                </BioSection>
                <BioSection>
                    <BioYear>2021</BioYear>
                    Worked as an Software Intern at Celebrythm! Hyderabad, India
                </BioSection>
                <BioSection>
                    <BioYear>2022 to present</BioYear>
                    Works as a Software Intern at Headout! Bengaluru, India
                </BioSection>
                <BioSection>
                    <BioYear>2020 to present</BioYear>
                    Works as a freelance
                </BioSection>
            </Section>

            <Section delay={0.3}>
                <Heading as="h3" variant="section-title">
                    I ♥
                </Heading>
                <Paragraph>
                    Designing, , Blockchain Development, , Machine Learning
                </Paragraph>
            </Section>

            <Section delay={0.3}>
                <Heading as="h3" variant="section-title">
                    On the web
                </Heading>
                <List>
                    <ListItem>
                        <Link
                            href="https://github.com/pranav2012"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoLogoGithub} />}
                            >
                                @pranav2012
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            href="https://twitter.com/Pranav__agr"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoLogoTwitter} />}
                            >
                                @Pranav__agr
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            href="https://www.linkedin.com/in/pranav-agarwal-579363166"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoLogoLinkedin} />}
                            >
                                pranav-agarwal
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            href="mailto:p2012agarwal@gmail.com"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoMail} />}
                            >
                                p2012agarwal@gmail.com
                            </Button>
                        </Link>
                    </ListItem>
                </List>

                <SimpleGrid columns={[1, 2, 2]} gap={6}>
                    <GridItem
                        href="https://www.youtube.com/channel/UCTD34th0vM-09Nt9Jf0jMWg"
                        title="Pranav Agarwal"
                        thumbnail={thumbYouTube}
                    >
                        My YouTube channel
                    </GridItem>
                    <GridItem
                        href="https://moyyn.com"
                        title="Moyyn"
                        thumbnail={thumbInkdrop}
                    >
                        A.I based reverse job searching platform
                    </GridItem>
                </SimpleGrid>

                <Box align="center" my={4}>
                    <NextLink href="/works">
                        <Button
                            rightIcon={<ChevronRightIcon />}
                            colorScheme="teal"
                        >
                            My Work
                        </Button>
                    </NextLink>
                </Box>
            </Section>
        </Container>
    </Layout>
);

export default Home;

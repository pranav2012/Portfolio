import NextLink from 'next/link';
import {
    Link,
    Container,
    Heading,
    Box,
    Image,
    SimpleGrid,
    Button,
    Icon,
    useColorModeValue
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Paragraph from 'Elements/paragraph';
import { BioSection, BioYear } from 'Elements/bio';
import Layout from 'Layouts/article';
import Section from 'Elements/section';
import { GridItem } from 'Elements/grid-item';
import {
    IoLogoTwitter,
    IoLogoLinkedin,
    IoMail,
    IoLogoGithub
} from 'react-icons/io5';
import thumbYouTube from 'Assets/links/youtube.png';
import thumbInkdrop from 'Assets/works/moyyn.png';

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
                    <p>Software Engineer ( Developer )</p>
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
                        src="/images/pranav.jpeg"
                        alt="Profile image"
                    />
                </Box>
            </Box>

            <Section delay={0.1}>
                <Heading as="h3" variant="section-title">
                    About Me
                </Heading>
                <Paragraph>
                    I&apos;m a freelancer and a full-stack developer based in
                    Delhi with a passion for building Performant & Scalable Web / Mobile Applications using
                    React.js / Next.js, and React Native. Have also worked with following technologies Spring, Web3, Node.Js, Flutter, AWS, Digital Ocean.
                    Have built scalable products which is currently being used
                    by millions of users daily
                    <NextLink href="https://headout.com">
                        <Link> Headout</Link>
                    </NextLink> &
                    <NextLink href="/works/moyyn">
                        <Link> Moyyn</Link>
                    </NextLink> 
                    .
                </Paragraph>
                <Box align="center" my={4}>
                    <a
                        href="https://drive.google.com/file/d/1mqQDhM_wICCdKI6l2iQjvjnPNqqKqbio/view"
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
                    Education
                </Heading>
                <BioSection>
                    B.Tech in C.S.E from Manav Rachna International
                    Institute of Research and Studies 
                <BioYear style={{color: useColorModeValue('#65b1b0','#85d8e3')}}> (2023)</BioYear>
                </BioSection>
            </Section>
            <Section delay={0.2}>
                <Heading as="h3" variant="section-title">
                    Experience
                </Heading>
                <BioSection>
                    Software Engineer at Headout! <br/>
                    <BioYear style={{color: useColorModeValue('#65b1b0','#85d8e3')}}> Bangalore, India - Remote (Jan, 2022 - Present)</BioYear>
                </BioSection>
                <BioSection>
                    Freelancer at Moyyn! <br/>
                    <BioYear style={{color: useColorModeValue('#65b1b0','#85d8e3')}}> Berlin, Germany - Remote (Nov, 2020 - May, 2021)</BioYear>
                </BioSection>
                <BioSection>
                    Software Intern at American Express! <br/>
                    <BioYear style={{color: useColorModeValue('#65b1b0','#85d8e3')}}> Gurugram, India (July, 2022 - Present)</BioYear>
                </BioSection>
            </Section>

            <Section delay={0.3}>
                <Heading as="h3" variant="section-title">
                    I <span style={{color: "red"}}>♥</span> learning about
                </Heading>
                <Paragraph>
                    System Architectures, Devops, Designing
                </Paragraph>
            </Section>

            <Section delay={0.3}>
                <Heading as="h3" variant="section-title">
                    Let&apos;s Connect
                </Heading>
                <SimpleGrid columns={[2, 4, 4]} gap={2} marginTop={2}>
                    <Box>
                        <Link
                            href="https://github.com/pranav2012"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoLogoGithub} />}
                            >
                                Github
                            </Button>
                        </Link>
                    </Box>
                    <Box>
                        <Link
                            href="https://twitter.com/Pranav__agr"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoLogoTwitter} />}
                            >
                                Twitter
                            </Button>
                        </Link>
                    </Box>
                    <Box>
                        <Link
                            href="https://www.linkedin.com/in/pranav-agarwal-579363166"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoLogoLinkedin} />}
                            >
                                Linkedin
                            </Button>
                        </Link>
                    </Box>
                    <Box>
                        <Link
                            href="mailto:p2012agarwal@gmail.com"
                            target="_blank"
                        >
                            <Button
                                variant="ghost"
                                colorScheme="teal"
                                leftIcon={<Icon as={IoMail} />}
                            >
                                Mail Me
                            </Button>
                        </Link>
                    </Box>
                </SimpleGrid>

                <SimpleGrid columns={[1, 2, 2]} gap={6} marginTop={2}>
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

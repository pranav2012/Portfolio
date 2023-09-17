import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react';
import Layout from '../src/components/layouts/article';
import Section from '../src/components/section';
import { WorkGridItem } from '../src/components/grid-item';
import thumbBuisness from '../src/assets/works/buisness.jpg';
import thumbCovid from '../src/assets/works/covid-care.png';
import thumbFace from '../src/assets/works/nefilus.png';
import thumbMoyyn from '../src/assets/works/moyyn.png';
import thumbCompiler from '../src/assets/works/online-compiler.png';
import thumbKyc from '../src/assets/works/open-kyc.jpg';
import thumbProject from '../src/assets/works/project-showcase.png';
import thumbVideo from '../src/assets/works/video-connect.png';

const Works = () => (
    <Layout title="Works">
        <Container>
            <Heading as="h3" fontSize={20} mb={4}>
                My Work
            </Heading>

            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Section>
                    <WorkGridItem
                        link="https://covidcare-alpha.vercel.app"
                        title="Covide Care"
                        thumbnail={thumbCovid}
                    >
                        A Web App to request and volunteer for help during covid
                        pandamic
                    </WorkGridItem>
                </Section>
                <Section>
                    <WorkGridItem
                        link="https://code-editor-rust.vercel.app"
                        title="Frontend IDE"
                        thumbnail={thumbCompiler}
                    >
                        Online HTML / CSS / JS Code Compiler
                    </WorkGridItem>
                </Section>

                <Section delay={0.1}>
                    <WorkGridItem
                        link="https://github.com/pranav2012/VideoConnect-with-amplify-auth"
                        thumbnail={thumbVideo}
                        title="Video Connect"
                    >
                        Short Video Showcase Web App using AWS Amplify
                    </WorkGridItem>
                </Section>
                <Section delay={0.1}>
                    <WorkGridItem
                        link="nefilus.vercel.app"
                        thumbnail={thumbFace}
                        title="Nefilus"
                    >
                        NFT Market Place
                    </WorkGridItem>
                </Section>
            </SimpleGrid>

            <Section delay={0.2}>
                <Divider my={6} />

                <Heading as="h3" fontSize={20} mb={4}>
                    Collaborations
                </Heading>
            </Section>

            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Section delay={0.3}>
                    <WorkGridItem
                        link="https://github.com/pranav2012/AmexHack"
                        thumbnail={thumbKyc}
                        title="Open KYC"
                    >
                        Blockchain based Web D-App for Banking / Financial KYC
                        proccess
                    </WorkGridItem>
                </Section>
                <Section delay={0.3}>
                    <WorkGridItem
                        link="https://moyyn.com"
                        thumbnail={thumbMoyyn}
                        title="Moyyn"
                    >
                        A.I based reverse job searhing platform
                    </WorkGridItem>
                </Section>
            </SimpleGrid>

            <Section delay={0.4}>
                <Divider my={6} />

                <Heading as="h3" fontSize={20} mb={4}>
                    Old works
                </Heading>
            </Section>

            <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Section delay={0.5}>
                    <WorkGridItem
                        link="https://pranavportfolio.netlify.app"
                        thumbnail={thumbProject}
                        title="Project Showcase"
                    >
                        It contains all information about me all my projects and
                        work at one place
                    </WorkGridItem>
                </Section>
                <Section delay={0.5}>
                    <WorkGridItem
                        link="https://agitated-wiles-fd5a49.netlify.app"
                        thumbnail={thumbBuisness}
                        title="Buisness Website"
                    >
                        It showcases about the compnay, their Products and
                        conatct Details
                    </WorkGridItem>
                </Section>
            </SimpleGrid>
        </Container>
    </Layout>
);

export default Works;

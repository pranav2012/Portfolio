import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import Layout from 'Layouts/article';
import Section from 'Elements/section';
import { GridItem } from 'Elements/grid-item';
import thumbHacktober2020 from 'Assets/posts/hacktoberfest2020.webp';
import thumbGdscUnboxing from 'Assets/posts/gdsc-unboxing.webp';
import thumbGdscApply from 'Assets/posts/gdsc-apply.webp';
import allAboutGdsc from 'Assets/posts/all_about_gdsc.jpg';

const Posts = () => (
    <Layout title="Posts">
        <Container>
            <Heading as="h3" fontSize={20} mb={4}>
                Popular Posts
            </Heading>

            <Section delay={0.1}>
                <SimpleGrid columns={[1, 2, 2]} gap={6}>
                    <GridItem
                        title="GDSC Lead Welcome kit Unboxing !!"
                        thumbnail={thumbGdscUnboxing}
                        href="https://youtu.be/LbRAVuS3vgI"
                    />
                    <GridItem
                        title="GDSC Lead Application Video"
                        thumbnail={thumbGdscApply}
                        href="https://youtu.be/473F3LRym9U"
                    />
                    <GridItem
                        title="Hacktoberfest 2020"
                        thumbnail={thumbHacktober2020}
                        href="https://dev.to/pranav2012/hacktoberfest-2020-1all"
                    />
                    <GridItem
                        title="All about G.D.S.C"
                        thumbnail={allAboutGdsc}
                        href="https://youtu.be/USYhMbLjv5Q"
                    />
                </SimpleGrid>
            </Section>

            {/* <Section delay={0.3}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          
        </SimpleGrid>
      </Section>

      <Section delay={0.5}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          
        </SimpleGrid>
      </Section> */}
        </Container>
    </Layout>
);

export default Posts;

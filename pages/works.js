import {
    Container,
    Heading,
    SimpleGrid,
    Separator,
    Text
} from '@chakra-ui/react';
import Layout from 'Layouts/article';
import Section from 'Elements/section';
import { WorkGridItem } from 'Elements/grid-item';
import { withLayout } from 'Lib/cms';

const sections = [
    { value: 'featured', title: 'My Work' },
    { value: 'oss', title: 'Open source & tools' },
    { value: 'archive', title: 'Earlier work' }
];

const Works = ({ projects }) => {
    const groups = sections
        .map(section => ({
            ...section,
            items: projects.filter(p => p.section === section.value)
        }))
        .filter(group => group.items.length > 0);

    return (
        <Layout title="Works">
            <Container>
                {groups.length === 0 && <Text>Nothing here yet.</Text>}
                {groups.map((group, i) => (
                    <Section key={group.value} delay={i * 0.2}>
                        {i > 0 && <Separator my={6} />}
                        <Heading as="h3" fontSize={20} mb={4}>
                            {group.title}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 2]} gap={6}>
                            {group.items.map(project => (
                                <WorkGridItem
                                    key={project.id}
                                    project={project}
                                />
                            ))}
                        </SimpleGrid>
                    </Section>
                ))}
            </Container>
        </Layout>
    );
};

export const getServerSideProps = () =>
    withLayout(async cms => {
        const { docs } = await cms.find({
            collection: 'projects',
            sort: 'order',
            limit: 100,
            depth: 1
        });
        return { projects: docs };
    });

export default Works;

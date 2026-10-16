import NextLink from 'next/link';
import Image from 'next/image';
import {
    Box,
    Text,
    LinkBox,
    LinkOverlay,
    Badge,
    HStack,
    Link,
    Flex
} from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { IoArrowForward } from 'react-icons/io5';

const cardImage = media => {
    if (!media || typeof media !== 'object' || !media.url) return null;
    const card = media.sizes?.card;
    return card?.url
        ? { src: card.url, width: card.width, height: card.height }
        : { src: media.url, width: media.width, height: media.height };
};

// Shown when a project has no image: the title set large on a soft gradient.
const Placeholder = ({ title }) => (
    <Flex
        className="grid-item-thumbnail"
        aspectRatio={1200 / 630}
        align="center"
        justify="center"
        px={6}
        bgGradient="to-br"
        gradientFrom={{ base: 'teal.200', _dark: 'teal.700' }}
        gradientTo={{ base: 'purple.200', _dark: 'purple.800' }}
    >
        <Text
            fontFamily="heading"
            fontWeight="bold"
            fontSize={{ base: 'xl', md: '2xl' }}
            textAlign="center"
            color={{ base: 'gray.800', _dark: 'whiteAlpha.900' }}
        >
            {title}
        </Text>
    </Flex>
);

export const Thumbnail = ({ media, title }) => {
    const image = cardImage(media);
    if (!image) return <Placeholder title={title} />;
    return (
        <Image
            {...image}
            alt={media.alt || title}
            className="grid-item-thumbnail"
            sizes="(max-width: 768px) 100vw, 360px"
            style={{ width: '100%', height: 'auto' }}
        />
    );
};

export const WorkGridItem = ({ project }) => {
    const { title, summary, thumbnail, url, links, stack, year } = project;
    return (
        <Box w="100%">
            <LinkBox cursor={url ? 'pointer' : undefined}>
                <Thumbnail media={thumbnail} title={title} />
                <HStack mt={3} justify="space-between" align="baseline">
                    {url ? (
                        <LinkOverlay
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Text fontSize={20} fontWeight="semibold">
                                {title}
                            </Text>
                        </LinkOverlay>
                    ) : (
                        <Text fontSize={20} fontWeight="semibold">
                            {title}
                        </Text>
                    )}
                    {year && (
                        <Text fontSize="sm" opacity={0.6}>
                            {year}
                        </Text>
                    )}
                </HStack>
                <Text fontSize={14} mt={1}>
                    {summary}
                </Text>
                {stack?.length > 0 && (
                    <HStack mt={2} gap={1} wrap="wrap">
                        {stack.map(tag => (
                            <Badge
                                key={tag}
                                colorPalette="teal"
                                variant="subtle"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </HStack>
                )}
                {links?.length > 0 && (
                    <HStack mt={2} gap={3} fontSize="sm" position="relative">
                        {links.map(link => (
                            <Link
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </HStack>
                )}
            </LinkBox>
        </Box>
    );
};

export const formatDate = value =>
    value
        ? new Date(value).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC'
          })
        : null;

export const PostItem = ({ post }) => (
    <LinkBox
        as="article"
        p={4}
        borderRadius="lg"
        bg={{ base: 'whiteAlpha.500', _dark: 'whiteAlpha.100' }}
        _hover={{ bg: { base: 'whiteAlpha.700', _dark: 'whiteAlpha.200' } }}
        transition="background 0.2s"
    >
        <Text fontSize="sm" opacity={0.6}>
            {formatDate(post.publishedAt)}
        </Text>
        <LinkOverlay asChild>
            <NextLink href={`/blog/${post.slug}`}>
                <Text fontSize={18} fontWeight="semibold" mt={1}>
                    {post.title}
                </Text>
            </NextLink>
        </LinkOverlay>
        {post.excerpt && (
            <Text fontSize={14} mt={1}>
                {post.excerpt}
            </Text>
        )}
        <HStack mt={2} fontSize="sm" color="link" gap={1}>
            <span>Read</span> <IoArrowForward />
        </HStack>
    </LinkBox>
);

export const GridItemStyle = () => (
    <Global
        styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
        overflow: hidden;
      }
    `}
    />
);

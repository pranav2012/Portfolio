import NextLink from 'next/link';
import { Heading, Box, Image, Link, Badge } from '@chakra-ui/react';
import { IoChevronForward } from 'react-icons/io5';

export const Title = ({ children }) => (
    <Box>
        <Link asChild>
            <NextLink href="/works">Works</NextLink>
        </Link>
        <span>
            {' '}
            <IoChevronForward style={{ display: 'inline' }} />{' '}
        </span>
        <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
            {children}
        </Heading>
    </Box>
);

export const WorkImage = ({ src, alt }) => (
    <Image borderRadius="lg" w="full" src={src} alt={alt} mb={4} />
);

export const Meta = ({ children }) => (
    <Badge colorPalette="green" mr={2}>
        {children}
    </Badge>
);

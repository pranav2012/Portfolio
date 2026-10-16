import Logo from 'Elements/logo';
import NextLink from 'next/link';
import {
    Container,
    Box,
    Link,
    Stack,
    Heading,
    Flex,
    Menu,
    Portal,
    IconButton
} from '@chakra-ui/react';
import { IoMenu } from 'react-icons/io5';
import ThemeToggleButton from 'Elements/theme-toggle-button';

const LinkItem = ({ href, active, _target, children, ...props }) => {
    return (
        <Link
            asChild
            p={2}
            borderRadius={8}
            bg={active ? 'grassTeal' : undefined}
            color={
                active
                    ? '#202023'
                    : { base: 'gray.800', _dark: 'whiteAlpha.900' }
            }
            target={_target}
            {...props}
        >
            <NextLink href={href}>{children}</NextLink>
        </Link>
    );
};

const Navbar = ({ path, name }) => {
    const isActive = href => path === href || path.startsWith(`${href}/`);

    return (
        <Box
            position="fixed"
            as="nav"
            w="100%"
            bg={{ base: '#ffffff40', _dark: '#20202380' }}
            style={{ backdropFilter: 'blur(10px)' }}
            zIndex={1}
        >
            <Container
                display="flex"
                p={2}
                maxW="3xl"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
            >
                <Flex align="center" mr={5}>
                    <Heading as="h1" size="lg" letterSpacing={'tighter'}>
                        <Logo name={name} />
                    </Heading>
                </Flex>

                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    display={{ base: 'none', md: 'flex' }}
                    width={{ base: 'full', md: 'auto' }}
                    alignItems="center"
                    flexGrow={1}
                    mt={{ base: 4, md: 0 }}
                >
                    <LinkItem href="/works" active={isActive('/works')}>
                        Works
                    </LinkItem>
                    <LinkItem href="/blog" active={isActive('/blog')}>
                        Blog
                    </LinkItem>
                </Stack>

                <Box flex={1} textAlign="right">
                    <ThemeToggleButton />

                    <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <IconButton
                                    variant="outline"
                                    aria-label="Options"
                                >
                                    <IoMenu />
                                </IconButton>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item value="about" asChild>
                                            <NextLink href="/">About</NextLink>
                                        </Menu.Item>
                                        <Menu.Item value="works" asChild>
                                            <NextLink href="/works">
                                                Works
                                            </NextLink>
                                        </Menu.Item>
                                        <Menu.Item value="blog" asChild>
                                            <NextLink href="/blog">
                                                Blog
                                            </NextLink>
                                        </Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Navbar;

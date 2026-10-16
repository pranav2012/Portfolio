import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
    globalCss: {
        'html, body': {
            bg: 'bg.page'
        },
        '.rich-text': {
            lineHeight: '1.7',
            '& > * + *': { marginTop: '1em' },
            '& a': {
                color: 'link',
                textUnderlineOffset: '3px',
                _hover: { textDecoration: 'underline' }
            },
            '& h1, & h2, & h3, & h4': {
                fontFamily: 'heading',
                fontWeight: 'bold',
                lineHeight: '1.3',
                marginTop: '1.6em'
            },
            '& h1': { fontSize: '2xl' },
            '& h2': { fontSize: 'xl' },
            '& h3, & h4': { fontSize: 'lg' },
            '& ul, & ol': { paddingInlineStart: '1.5em' },
            '& ul': { listStyleType: 'disc' },
            '& ol': { listStyleType: 'decimal' },
            '& li + li': { marginTop: '0.25em' },
            '& blockquote': {
                borderInlineStartWidth: '4px',
                borderColor: 'grassTeal',
                paddingInlineStart: '1em',
                fontStyle: 'italic',
                opacity: 0.85
            },
            '& code': {
                fontFamily: 'mono',
                fontSize: '0.9em',
                px: '1',
                borderRadius: 'sm',
                bg: { base: 'blackAlpha.100', _dark: 'whiteAlpha.200' }
            },
            '& img': { borderRadius: 'lg', maxWidth: '100%', height: 'auto' },
            '& hr': { borderColor: 'border', marginBlock: '2em' }
        }
    },
    theme: {
        tokens: {
            colors: {
                grassTeal: { value: '#88ccca' }
            },
            fonts: {
                heading: { value: "'M PLUS Rounded 1c', sans-serif" }
            }
        },
        semanticTokens: {
            colors: {
                'bg.page': {
                    value: { base: '#f0e7db', _dark: '#202023' }
                },
                link: {
                    value: { base: '#3d7aed', _dark: '#ff63c3' }
                }
            }
        },
        recipes: {
            container: {
                base: {
                    maxWidth: '60ch',
                    px: '4'
                }
            },
            heading: {
                variants: {
                    variant: {
                        'section-title': {
                            textDecoration: 'underline',
                            fontSize: '20px',
                            textUnderlineOffset: '6px',
                            textDecorationColor: '#525252',
                            textDecorationThickness: '4px',
                            marginTop: '3',
                            marginBottom: '4'
                        }
                    }
                }
            },
            link: {
                base: {
                    color: 'link',
                    textUnderlineOffset: '3px'
                },
                variants: {
                    variant: {
                        plain: { color: 'link' }
                    }
                }
            }
        }
    }
});

const system = createSystem(defaultConfig, config);
export default system;

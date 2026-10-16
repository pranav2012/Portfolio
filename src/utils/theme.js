import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
    globalCss: {
        'html, body': {
            bg: 'bg.page'
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

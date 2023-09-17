import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import theme from 'Utils/theme';
export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <ColorModeScript
                        initialColorMode={theme.config.initialColorMode}
                        storageKey='my-key'
                        type='cookie'
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

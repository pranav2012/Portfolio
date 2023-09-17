/* eslint-disable @next/next/inline-script-id */
import { ChakraProvider } from '@chakra-ui/react';
import Layout from 'Layouts/main';
import Fonts from 'Utils/fonts';
import theme from 'Utils/theme';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';

function Website({ Component, pageProps, router }) {
    return (
        <>
        <Script
            strategy='lazyOnload'
            src="https://www.googletagmanager.com/gtag/js?id=G-D1FQW8B99F"/>
        <Script strategy="lazyOnload">
            {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D1FQW8B99F');`}
        </Script>
        <ChakraProvider theme={theme}>
            <Fonts />
            <Layout router={router}>
                <AnimatePresence exitBeforeEnter initial={true}>
                    <Component {...pageProps} key={router.route} />
                </AnimatePresence>
            </Layout>
        </ChakraProvider>
        </>
    );
}

export default Website;

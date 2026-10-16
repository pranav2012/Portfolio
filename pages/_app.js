import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import Layout from 'Layouts/main';
import Fonts from 'Utils/fonts';
import system from 'Utils/theme';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';

function Website({ Component, pageProps, router }) {
    const analyticsId = pageProps.site?.analyticsId;
    return (
        <>
            {analyticsId && (
                <>
                    <Script
                        id="gtag-src"
                        strategy="lazyOnload"
                        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
                    />
                    <Script id="gtag-init" strategy="lazyOnload">
                        {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analyticsId}');`}
                    </Script>
                </>
            )}
            <ChakraProvider value={system}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Fonts />
                    <Layout router={router} site={pageProps.site}>
                        <AnimatePresence mode="wait" initial={true}>
                            <Component {...pageProps} key={router.route} />
                        </AnimatePresence>
                    </Layout>
                </ThemeProvider>
            </ChakraProvider>
        </>
    );
}

export default Website;

import { AnimatePresence, motion } from 'framer-motion';
import { Box, ClientOnly, IconButton } from '@chakra-ui/react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from 'next-themes';

const ThemeToggleButton = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <ClientOnly fallback={<Box display="inline-block" boxSize="10" />}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    style={{ display: 'inline-block' }}
                    key={resolvedTheme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <IconButton
                        aria-label="Toggle theme"
                        colorPalette={isDark ? 'orange' : 'purple'}
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    >
                        {isDark ? <IoSunny /> : <IoMoon />}
                    </IconButton>
                </motion.div>
            </AnimatePresence>
        </ClientOnly>
    );
};

export default ThemeToggleButton;

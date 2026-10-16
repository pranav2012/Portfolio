import { Box } from '@chakra-ui/react';

const Footer = ({ name }) => {
    return (
        <Box textAlign="center" opacity={0.4} fontSize="sm">
            &copy; {new Date().getFullYear()} {name}. All Rights Reserved.
        </Box>
    );
};

export default Footer;

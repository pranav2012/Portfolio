import { Box } from '@chakra-ui/react';
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react';

const RichText = ({ data, ...props }) =>
    data ? (
        <Box className="rich-text" {...props}>
            <LexicalRichText data={data} disableContainer />
        </Box>
    ) : null;

export default RichText;

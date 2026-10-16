// Tiny builders for Lexical JSON, so seed content stays readable.
type Inline =
    string | { text: string; url: string } | { text: string; bold: true };

const text = (value: string, format = 0) => ({
    type: 'text',
    text: value,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1
});

const inline = (node: Inline) => {
    if (typeof node === 'string') return text(node);
    if ('url' in node) {
        return {
            type: 'link',
            fields: { linkType: 'custom', url: node.url, newTab: true },
            children: [text(node.text)],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 3
        };
    }
    return text(node.text, 1);
};

export const paragraph = (...children: Inline[]) => ({
    type: 'paragraph',
    children: children.map(inline),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    version: 1
});

export const richText = (...paragraphs: ReturnType<typeof paragraph>[]) => ({
    root: {
        type: 'root',
        children: paragraphs,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1
    }
});

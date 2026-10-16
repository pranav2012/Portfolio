import type { Field } from 'payload';
import {
    BlocksFeature,
    CodeBlock,
    EXPERIMENTAL_TableFeature,
    lexicalEditor,
    UploadFeature
} from '@payloadcms/richtext-lexical';

// Languages offered for code blocks. The site highlights them at build time.
export const codeLanguages = {
    typescript: 'TypeScript',
    ts: 'TypeScript (ts)',
    tsx: 'TSX',
    javascript: 'JavaScript',
    kotlin: 'Kotlin',
    swift: 'Swift',
    cpp: 'C++',
    glsl: 'GLSL / SkSL',
    rust: 'Rust',
    go: 'Go',
    shell: 'Shell',
    bash: 'Bash',
    sh: 'sh',
    python: 'Python',
    yaml: 'YAML',
    json: 'JSON',
    dockerfile: 'Dockerfile',
    ini: 'INI',
    diff: 'Diff',
    plaintext: 'Plain text',
    text: 'Text'
};

// A post's body: the default editor plus code blocks, tables, and a caption
// on images.
export const postContent: Field = {
    name: 'content',
    type: 'richText',
    required: true,
    editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
            ...defaultFeatures.filter(feature => feature.key !== 'upload'),
            UploadFeature({
                collections: {
                    media: { fields: [{ name: 'caption', type: 'text' }] }
                }
            }),
            BlocksFeature({
                blocks: [
                    CodeBlock({
                        languages: codeLanguages,
                        defaultLanguage: 'typescript'
                    })
                ]
            }),
            EXPERIMENTAL_TableFeature()
        ]
    })
};

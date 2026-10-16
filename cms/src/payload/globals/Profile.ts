import type { GlobalConfig } from 'payload';
import { anyone } from '../access';
import { htmlOf } from '../fields/html';
import { publishAfterGlobalChange } from '../publish';

export const Profile: GlobalConfig = {
    slug: 'profile',
    access: { read: anyone },
    hooks: { afterChange: [publishAfterGlobalChange] },
    admin: {
        group: 'Site',
        description: 'Everything on the home page.'
    },
    fields: [
        {
            type: 'row',
            fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text', required: true }
            ]
        },
        {
            name: 'greeting',
            type: 'text',
            admin: { description: 'The banner under the 3D model.' }
        },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'about', type: 'richText' },
        htmlOf('about'),
        {
            name: 'resume',
            type: 'upload',
            relationTo: 'media',
            label: 'Resume (PDF)',
            filterOptions: { mimeType: { equals: 'application/pdf' } },
            admin: {
                description:
                    'Published at pranav-agarwal.com/resume.pdf. Upload a new one to replace it.'
            }
        },
        {
            name: 'resumeUrl',
            type: 'text',
            label: 'Resume link',
            admin: { description: 'Used only when no PDF is uploaded.' }
        },
        {
            name: 'experience',
            type: 'array',
            admin: { initCollapsed: true },
            fields: [
                {
                    type: 'row',
                    fields: [
                        { name: 'role', type: 'text', required: true },
                        { name: 'company', type: 'text', required: true },
                        { name: 'companyUrl', type: 'text' }
                    ]
                },
                {
                    type: 'row',
                    fields: [
                        { name: 'location', type: 'text' },
                        {
                            name: 'period',
                            type: 'text',
                            admin: { placeholder: 'Jan 2022 – Present' }
                        }
                    ]
                },
                { name: 'description', type: 'textarea' }
            ]
        },
        {
            name: 'education',
            type: 'array',
            admin: { initCollapsed: true },
            fields: [
                {
                    type: 'row',
                    fields: [
                        { name: 'degree', type: 'text', required: true },
                        { name: 'school', type: 'text', required: true },
                        { name: 'year', type: 'text' }
                    ]
                }
            ]
        },
        {
            name: 'interests',
            type: 'text',
            label: 'I ♥ …',
            admin: { description: 'Comma-separated or a short sentence.' }
        },
        {
            name: 'socials',
            type: 'array',
            admin: { initCollapsed: true },
            fields: [
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'platform',
                            type: 'select',
                            required: true,
                            options: [
                                'github',
                                'linkedin',
                                'x',
                                'email',
                                'medium',
                                'youtube',
                                'stackoverflow',
                                'website'
                            ]
                        },
                        { name: 'label', type: 'text', required: true },
                        { name: 'url', type: 'text', required: true }
                    ]
                }
            ]
        }
    ]
};

import type { GlobalConfig } from 'payload';
import { anyone } from '../access';

export const Profile: GlobalConfig = {
    slug: 'profile',
    access: { read: anyone },
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
        { name: 'resumeUrl', type: 'text', label: 'Resume link' },
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

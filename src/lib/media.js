// Safe to import from components (cms.js pulls Payload into the bundle).
export const mediaUrl = media =>
    media && typeof media === 'object' ? media.url : null;

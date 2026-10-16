import { spawn } from 'child_process';
import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    GlobalAfterChangeHook,
    Payload
} from 'payload';

// Publishes the site after content changes: PUBLISH_COMMAND (set in the
// Docker image to scripts/publish.sh) exports the content into the site's
// repo and pushes it, and Cloudflare deploys the push. Without the command
// or a GITHUB_TOKEN, e.g. in local development, publishing is skipped.
// Changes made close together are batched into one publish, and a change
// during a publish queues one more after it.
const DELAY_MS = 15_000;

let timer: NodeJS.Timeout | null = null;
let running = false;
let queued = false;

const run = (payload: Payload) => {
    const command = process.env.PUBLISH_COMMAND;
    if (!command || !process.env.GITHUB_TOKEN) {
        payload.logger.info(
            'Content changed; PUBLISH_COMMAND or GITHUB_TOKEN is not set, so the site was not published'
        );
        return;
    }
    running = true;
    queued = false;
    payload.logger.info('Publishing the site…');
    const started = Date.now();
    const child = spawn('sh', ['-c', command], {
        stdio: ['ignore', 'pipe', 'pipe']
    });
    let output = '';
    const keep = (chunk: Buffer) => {
        output = (output + chunk.toString()).slice(-4000);
    };
    child.stdout.on('data', keep);
    child.stderr.on('data', keep);
    child.on('close', code => {
        running = false;
        const seconds = Math.round((Date.now() - started) / 1000);
        if (code === 0)
            payload.logger.info(`Published the site in ${seconds}s`);
        else
            payload.logger.error(
                `Publishing failed (exit ${code}):\n${output}`
            );
        if (queued) schedulePublish(payload);
    });
};

export const schedulePublish = (payload: Payload) => {
    if (running) {
        queued = true;
        return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        timer = null;
        run(payload);
    }, DELAY_MS);
};

export const publishAfterChange: CollectionAfterChangeHook = ({
    doc,
    previousDoc,
    req
}) => {
    // Saving a draft that was never published doesn't change the site.
    const drafts = doc?._status !== undefined;
    if (
        !drafts ||
        doc._status === 'published' ||
        previousDoc?._status === 'published'
    )
        schedulePublish(req.payload);
    return doc;
};

export const publishAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    schedulePublish(req.payload);
    return doc;
};

export const publishAfterGlobalChange: GlobalAfterChangeHook = ({
    doc,
    req
}) => {
    schedulePublish(req.payload);
    return doc;
};

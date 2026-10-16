import * as migration_20261016_151930_initial from './20261016_151930_initial';
import * as migration_20261016_181518_videos from './20261016_181518_videos';

export const migrations = [
    {
        up: migration_20261016_151930_initial.up,
        down: migration_20261016_151930_initial.down,
        name: '20261016_151930_initial'
    },
    {
        up: migration_20261016_181518_videos.up,
        down: migration_20261016_181518_videos.down,
        name: '20261016_181518_videos'
    }
];

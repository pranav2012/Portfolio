import * as migration_20261016_151930_initial from './20261016_151930_initial';
import * as migration_20261016_181518_videos from './20261016_181518_videos';
import * as migration_20261016_193310_resume from './20261016_193310_resume';
import * as migration_20261016_213927_video_channel from './20261016_213927_video_channel';
import * as migration_20261017_002008_community from './20261017_002008_community';
import * as migration_20261017_010102_community_photos from './20261017_010102_community_photos';

export const migrations = [
  {
    up: migration_20261016_151930_initial.up,
    down: migration_20261016_151930_initial.down,
    name: '20261016_151930_initial',
  },
  {
    up: migration_20261016_181518_videos.up,
    down: migration_20261016_181518_videos.down,
    name: '20261016_181518_videos',
  },
  {
    up: migration_20261016_193310_resume.up,
    down: migration_20261016_193310_resume.down,
    name: '20261016_193310_resume',
  },
  {
    up: migration_20261016_213927_video_channel.up,
    down: migration_20261016_213927_video_channel.down,
    name: '20261016_213927_video_channel',
  },
  {
    up: migration_20261017_002008_community.up,
    down: migration_20261017_002008_community.down,
    name: '20261017_002008_community',
  },
  {
    up: migration_20261017_010102_community_photos.up,
    down: migration_20261017_010102_community_photos.down,
    name: '20261017_010102_community_photos'
  },
];

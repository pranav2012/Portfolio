import * as migration_20261016_151930_initial from './20261016_151930_initial';

export const migrations = [
  {
    up: migration_20261016_151930_initial.up,
    down: migration_20261016_151930_initial.down,
    name: '20261016_151930_initial'
  },
];

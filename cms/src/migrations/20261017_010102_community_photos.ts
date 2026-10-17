import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`community_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`community\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`community_rels_order_idx\` ON \`community_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`community_rels_parent_idx\` ON \`community_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`community_rels_path_idx\` ON \`community_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`community_rels_media_id_idx\` ON \`community_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`community\` ADD \`post_url\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`community_rels\`;`)
  await db.run(sql`ALTER TABLE \`community\` DROP COLUMN \`post_url\`;`)
}

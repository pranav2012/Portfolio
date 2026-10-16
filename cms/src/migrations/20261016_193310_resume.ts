import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`profile\` ADD \`resume_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`profile_resume_idx\` ON \`profile\` (\`resume_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_profile\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`greeting\` text,
  	\`photo_id\` integer,
  	\`about\` text,
  	\`resume_url\` text,
  	\`interests\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_profile\`("id", "name", "role", "greeting", "photo_id", "about", "resume_url", "interests", "updated_at", "created_at") SELECT "id", "name", "role", "greeting", "photo_id", "about", "resume_url", "interests", "updated_at", "created_at" FROM \`profile\`;`)
  await db.run(sql`DROP TABLE \`profile\`;`)
  await db.run(sql`ALTER TABLE \`__new_profile\` RENAME TO \`profile\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`profile_photo_idx\` ON \`profile\` (\`photo_id\`);`)
}

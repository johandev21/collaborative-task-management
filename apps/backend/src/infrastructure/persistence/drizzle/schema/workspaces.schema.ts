import { pgTable, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { organizationsTable } from './organizations.schema';

export const workspacesTable = pgTable(
  'workspaces',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    organizationId: varchar('organization_id', { length: 255 })
      .notNull()
      .references(() => organizationsTable.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('workspace_org_slug_idx').on(table.organizationId, table.slug),
  ],
);

export type WorkspaceSelect = typeof workspacesTable.$inferSelect;
export type WorkspaceInsert = typeof workspacesTable.$inferInsert;

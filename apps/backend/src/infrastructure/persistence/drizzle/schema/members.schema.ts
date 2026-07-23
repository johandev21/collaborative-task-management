import {
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { organizationsTable } from './organizations.schema';
import { workspacesTable } from './workspaces.schema';
import { Role } from '../../../../domain/organization/models/role.enum';

export const memberRoleEnum = pgEnum('member_role', [
  Role.Owner,
  Role.Admin,
  Role.Member,
  Role.Guest,
]);

export const membersTable = pgTable(
  'members',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    organizationId: varchar('organization_id', { length: 255 })
      .notNull()
      .references(() => organizationsTable.id, { onDelete: 'cascade' }),
    workspaceId: varchar('workspace_id', { length: 255 }).references(
      () => workspacesTable.id,
      { onDelete: 'cascade' },
    ),
    userId: varchar('user_id', { length: 255 }).notNull(),
    role: memberRoleEnum('role').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('member_org_ws_user_idx').on(
      table.organizationId,
      table.workspaceId,
      table.userId,
    ),
    index('member_org_user_idx').on(table.organizationId, table.userId),
    index('member_ws_user_idx').on(table.workspaceId, table.userId),
  ],
);

export type MemberSelect = typeof membersTable.$inferSelect;
export type MemberInsert = typeof membersTable.$inferInsert;

import { Injectable } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Member } from '../../../domain/organization/models/member.entity';
import { MemberRepositoryPort } from '../../../domain/organization/ports/member.repository.port';
import { membersTable } from './schema/members.schema';

@Injectable()
export class DrizzleMemberRepository implements MemberRepositoryPort {
  constructor(private readonly db: NodePgDatabase<any>) {}

  async save(member: Member): Promise<Member> {
    const [row] = await this.db
      .insert(membersTable)
      .values({
        id: member.id,
        organizationId: member.organizationId,
        workspaceId: member.workspaceId ?? null,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
      })
      .onConflictDoUpdate({
        target: membersTable.id,
        set: {
          role: member.role,
        },
      })
      .returning();

    return new Member(
      row.id,
      row.organizationId,
      row.userId,
      row.role,
      row.workspaceId,
      row.joinedAt,
    );
  }

  async findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<Member | null> {
    const [row] = await this.db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.organizationId, organizationId),
          eq(membersTable.userId, userId),
          isNull(membersTable.workspaceId),
        ),
      )
      .limit(1);

    if (!row) return null;

    return new Member(
      row.id,
      row.organizationId,
      row.userId,
      row.role,
      row.workspaceId,
      row.joinedAt,
    );
  }

  async findByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<Member | null> {
    const [row] = await this.db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.workspaceId, workspaceId),
          eq(membersTable.userId, userId),
        ),
      )
      .limit(1);

    if (!row) return null;

    return new Member(
      row.id,
      row.organizationId,
      row.userId,
      row.role,
      row.workspaceId,
      row.joinedAt,
    );
  }

  async listByOrganization(organizationId: string): Promise<Member[]> {
    const rows = await this.db
      .select()
      .from(membersTable)
      .where(eq(membersTable.organizationId, organizationId));

    return rows.map(
      (row) =>
        new Member(
          row.id,
          row.organizationId,
          row.userId,
          row.role,
          row.workspaceId,
          row.joinedAt,
        ),
    );
  }

  async listByWorkspace(workspaceId: string): Promise<Member[]> {
    const rows = await this.db
      .select()
      .from(membersTable)
      .where(eq(membersTable.workspaceId, workspaceId));

    return rows.map(
      (row) =>
        new Member(
          row.id,
          row.organizationId,
          row.userId,
          row.role,
          row.workspaceId,
          row.joinedAt,
        ),
    );
  }
}

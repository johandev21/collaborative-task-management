import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Workspace } from '../../../domain/organization/models/workspace.entity';
import { WorkspaceRepositoryPort } from '../../../domain/organization/ports/workspace.repository.port';
import { workspacesTable } from './schema/workspaces.schema';

@Injectable()
export class DrizzleWorkspaceRepository implements WorkspaceRepositoryPort {
  constructor(private readonly db: NodePgDatabase<any>) {}

  async save(workspace: Workspace): Promise<Workspace> {
    const [row] = await this.db
      .insert(workspacesTable)
      .values({
        id: workspace.id,
        organizationId: workspace.organizationId,
        name: workspace.name,
        slug: workspace.slug,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      })
      .onConflictDoUpdate({
        target: workspacesTable.id,
        set: {
          name: workspace.name,
          slug: workspace.slug,
          updatedAt: new Date(),
        },
      })
      .returning();

    return new Workspace(
      row.id,
      row.organizationId,
      row.name,
      row.slug,
      row.createdAt,
      row.updatedAt,
    );
  }

  async findById(id: string): Promise<Workspace | null> {
    const [row] = await this.db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, id))
      .limit(1);

    if (!row) return null;

    return new Workspace(
      row.id,
      row.organizationId,
      row.name,
      row.slug,
      row.createdAt,
      row.updatedAt,
    );
  }

  async findByOrganizationId(organizationId: string): Promise<Workspace[]> {
    const rows = await this.db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.organizationId, organizationId));

    return rows.map(
      (row) =>
        new Workspace(
          row.id,
          row.organizationId,
          row.name,
          row.slug,
          row.createdAt,
          row.updatedAt,
        ),
    );
  }

  async findBySlug(
    organizationId: string,
    slug: string,
  ): Promise<Workspace | null> {
    const [row] = await this.db
      .select()
      .from(workspacesTable)
      .where(
        and(
          eq(workspacesTable.organizationId, organizationId),
          eq(workspacesTable.slug, slug.toLowerCase()),
        ),
      )
      .limit(1);

    if (!row) return null;

    return new Workspace(
      row.id,
      row.organizationId,
      row.name,
      row.slug,
      row.createdAt,
      row.updatedAt,
    );
  }
}

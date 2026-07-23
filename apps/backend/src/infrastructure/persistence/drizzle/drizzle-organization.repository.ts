import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Organization } from '../../../domain/organization/models/organization.entity';
import { OrganizationRepositoryPort } from '../../../domain/organization/ports/organization.repository.port';
import { organizationsTable } from './schema/organizations.schema';

@Injectable()
export class DrizzleOrganizationRepository implements OrganizationRepositoryPort {
  constructor(private readonly db: NodePgDatabase<any>) {}

  async save(organization: Organization): Promise<Organization> {
    const [row] = await this.db
      .insert(organizationsTable)
      .values({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        ownerId: organization.ownerId,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      })
      .onConflictDoUpdate({
        target: organizationsTable.id,
        set: {
          name: organization.name,
          slug: organization.slug,
          ownerId: organization.ownerId,
          updatedAt: new Date(),
        },
      })
      .returning();

    return new Organization(
      row.id,
      row.name,
      row.slug,
      row.ownerId,
      row.createdAt,
      row.updatedAt,
    );
  }

  async findById(id: string): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, id))
      .limit(1);

    if (!row) return null;

    return new Organization(
      row.id,
      row.name,
      row.slug,
      row.ownerId,
      row.createdAt,
      row.updatedAt,
    );
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.slug, slug.toLowerCase()))
      .limit(1);

    if (!row) return null;

    return new Organization(
      row.id,
      row.name,
      row.slug,
      row.ownerId,
      row.createdAt,
      row.updatedAt,
    );
  }
}

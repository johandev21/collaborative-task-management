import { Organization } from '../../../domain/organization/models/organization.entity';
import { OrganizationRepositoryPort } from '../../../domain/organization/ports/organization.repository.port';

export class InMemoryOrganizationRepository
  implements OrganizationRepositoryPort
{
  private organizations: Map<string, Organization> = new Map();

  async save(organization: Organization): Promise<Organization> {
    this.organizations.set(organization.id, organization);
    return organization;
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const normalizedSlug = slug.toLowerCase();
    for (const org of this.organizations.values()) {
      if (org.slug.toLowerCase() === normalizedSlug) {
        return org;
      }
    }
    return null;
  }

  clear(): void {
    this.organizations.clear();
  }
}

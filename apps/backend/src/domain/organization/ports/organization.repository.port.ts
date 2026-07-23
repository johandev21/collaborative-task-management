import { Organization } from '../models/organization.entity';

export interface OrganizationRepositoryPort {
  save(organization: Organization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
}

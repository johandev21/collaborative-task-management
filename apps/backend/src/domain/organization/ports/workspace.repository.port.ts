import { Workspace } from '../models/workspace.entity';

export interface WorkspaceRepositoryPort {
  save(workspace: Workspace): Promise<Workspace>;
  findById(id: string): Promise<Workspace | null>;
  findByOrganizationId(organizationId: string): Promise<Workspace[]>;
  findBySlug(organizationId: string, slug: string): Promise<Workspace | null>;
}

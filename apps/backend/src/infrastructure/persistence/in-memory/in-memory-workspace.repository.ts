import { Workspace } from '../../../domain/organization/models/workspace.entity';
import { WorkspaceRepositoryPort } from '../../../domain/organization/ports/workspace.repository.port';

export class InMemoryWorkspaceRepository implements WorkspaceRepositoryPort {
  private workspaces: Map<string, Workspace> = new Map();

  async save(workspace: Workspace): Promise<Workspace> {
    this.workspaces.set(workspace.id, workspace);
    return workspace;
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.workspaces.get(id) ?? null;
  }

  async findByOrganizationId(organizationId: string): Promise<Workspace[]> {
    return Array.from(this.workspaces.values()).filter(
      (w) => w.organizationId === organizationId,
    );
  }

  async findBySlug(
    organizationId: string,
    slug: string,
  ): Promise<Workspace | null> {
    const normalizedSlug = slug.toLowerCase();
    for (const w of this.workspaces.values()) {
      if (
        w.organizationId === organizationId &&
        w.slug.toLowerCase() === normalizedSlug
      ) {
        return w;
      }
    }
    return null;
  }

  clear(): void {
    this.workspaces.clear();
  }
}

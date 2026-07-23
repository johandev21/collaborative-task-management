import { Workspace } from '../../../domain/organization/models/workspace.entity';
import { WorkspaceRepositoryPort } from '../../../domain/organization/ports/workspace.repository.port';
import { MemberRepositoryPort } from '../../../domain/organization/ports/member.repository.port';

export interface GetOrganizationWorkspacesQuery {
  organizationId: string;
  requesterUserId: string;
}

export class GetOrganizationWorkspacesUseCase {
  constructor(
    private readonly workspaceRepository: WorkspaceRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(
    query: GetOrganizationWorkspacesQuery,
  ): Promise<Workspace[]> {
    const member = await this.memberRepository.findByOrganizationAndUser(
      query.organizationId,
      query.requesterUserId,
    );

    if (!member) {
      throw new Error('User is not a member of this organization');
    }

    return await this.workspaceRepository.findByOrganizationId(
      query.organizationId,
    );
  }
}

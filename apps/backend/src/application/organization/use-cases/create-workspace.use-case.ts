import { Workspace } from '../../../domain/organization/models/workspace.entity';
import { Member } from '../../../domain/organization/models/member.entity';
import { Role } from '../../../domain/organization/models/role.enum';
import { OrganizationRepositoryPort } from '../../../domain/organization/ports/organization.repository.port';
import { WorkspaceRepositoryPort } from '../../../domain/organization/ports/workspace.repository.port';
import { MemberRepositoryPort } from '../../../domain/organization/ports/member.repository.port';

export interface CreateWorkspaceCommand {
  organizationId: string;
  name: string;
  slug: string;
  requesterUserId: string;
}

export class CreateWorkspaceUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly workspaceRepository: WorkspaceRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(command: CreateWorkspaceCommand): Promise<Workspace> {
    const org = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!org) {
      throw new Error('Organization not found');
    }

    const member = await this.memberRepository.findByOrganizationAndUser(
      command.organizationId,
      command.requesterUserId,
    );

    if (!member || (member.role !== Role.Owner && member.role !== Role.Admin)) {
      throw new Error('User is not authorized to create a workspace');
    }

    const existingSlug = await this.workspaceRepository.findBySlug(
      command.organizationId,
      command.slug,
    );
    if (existingSlug) {
      throw new Error(
        'Workspace with this slug already exists in the organization',
      );
    }

    const workspaceId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const workspace = Workspace.create({
      id: workspaceId,
      organizationId: command.organizationId,
      name: command.name,
      slug: command.slug,
    });

    const savedWorkspace = await this.workspaceRepository.save(workspace);

    // Automatically add requester to workspace as member with their org role
    const workspaceMemberId = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const workspaceMember = Member.create({
      id: workspaceMemberId,
      organizationId: command.organizationId,
      workspaceId: savedWorkspace.id,
      userId: command.requesterUserId,
      role: member.role,
    });

    await this.memberRepository.save(workspaceMember);

    return savedWorkspace;
  }
}

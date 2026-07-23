import { Member } from '../../../domain/organization/models/member.entity';
import { Role } from '../../../domain/organization/models/role.enum';
import { OrganizationRepositoryPort } from '../../../domain/organization/ports/organization.repository.port';
import { WorkspaceRepositoryPort } from '../../../domain/organization/ports/workspace.repository.port';
import { MemberRepositoryPort } from '../../../domain/organization/ports/member.repository.port';

export interface InviteMemberCommand {
  organizationId: string;
  workspaceId?: string;
  userId: string;
  role: Role;
  requesterUserId: string;
}

export class InviteMemberUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly workspaceRepository: WorkspaceRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(command: InviteMemberCommand): Promise<Member> {
    const org = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!org) {
      throw new Error('Organization not found');
    }

    if (command.workspaceId) {
      const workspace = await this.workspaceRepository.findById(
        command.workspaceId,
      );
      if (!workspace || workspace.organizationId !== command.organizationId) {
        throw new Error('Workspace not found in this organization');
      }
    }

    const requesterMember =
      await this.memberRepository.findByOrganizationAndUser(
        command.organizationId,
        command.requesterUserId,
      );

    if (
      !requesterMember ||
      (requesterMember.role !== Role.Owner &&
        requesterMember.role !== Role.Admin)
    ) {
      throw new Error('User is not authorized to invite members');
    }

    const memberId = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newMember = Member.create({
      id: memberId,
      organizationId: command.organizationId,
      workspaceId: command.workspaceId ?? null,
      userId: command.userId,
      role: command.role,
    });

    return await this.memberRepository.save(newMember);
  }
}

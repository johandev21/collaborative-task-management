import { InMemoryOrganizationRepository } from '../../../infrastructure/persistence/in-memory/in-memory-organization.repository';
import { InMemoryWorkspaceRepository } from '../../../infrastructure/persistence/in-memory/in-memory-workspace.repository';
import { InMemoryMemberRepository } from '../../../infrastructure/persistence/in-memory/in-memory-member.repository';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { CreateWorkspaceUseCase } from './create-workspace.use-case';
import { InviteMemberUseCase } from './invite-member.use-case';
import { Role } from '../../../domain/organization/models/role.enum';
import { Member } from '../../../domain/organization/models/member.entity';

describe('InviteMemberUseCase', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let workspaceRepo: InMemoryWorkspaceRepository;
  let memberRepo: InMemoryMemberRepository;
  let createOrgUseCase: CreateOrganizationUseCase;
  let createWorkspaceUseCase: CreateWorkspaceUseCase;
  let inviteMemberUseCase: InviteMemberUseCase;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    workspaceRepo = new InMemoryWorkspaceRepository();
    memberRepo = new InMemoryMemberRepository();
    createOrgUseCase = new CreateOrganizationUseCase(orgRepo, memberRepo);
    createWorkspaceUseCase = new CreateWorkspaceUseCase(
      orgRepo,
      workspaceRepo,
      memberRepo,
    );
    inviteMemberUseCase = new InviteMemberUseCase(orgRepo, workspaceRepo, memberRepo);
  });

  it('should allow Organization Admin or Owner to invite a new member with role', async () => {
    const org = await createOrgUseCase.execute({
      name: 'Acme',
      slug: 'acme',
      ownerUserId: 'owner-1',
    });

    const invitedMember = await inviteMemberUseCase.execute({
      organizationId: org.id,
      userId: 'user-2',
      role: Role.Admin,
      requesterUserId: 'owner-1',
    });

    expect(invitedMember.id).toBeDefined();
    expect(invitedMember.organizationId).toBe(org.id);
    expect(invitedMember.userId).toBe('user-2');
    expect(invitedMember.role).toBe(Role.Admin);
  });

  it('should allow Org Admin to invite a member to a workspace', async () => {
    const org = await createOrgUseCase.execute({
      name: 'Acme',
      slug: 'acme',
      ownerUserId: 'owner-1',
    });

    const workspace = await createWorkspaceUseCase.execute({
      organizationId: org.id,
      name: 'Dev',
      slug: 'dev',
      requesterUserId: 'owner-1',
    });

    const invited = await inviteMemberUseCase.execute({
      organizationId: org.id,
      workspaceId: workspace.id,
      userId: 'dev-user',
      role: Role.Guest,
      requesterUserId: 'owner-1',
    });

    expect(invited.workspaceId).toBe(workspace.id);
    expect(invited.role).toBe(Role.Guest);
  });

  it('should throw an error if requester is not Owner or Admin', async () => {
    const org = await createOrgUseCase.execute({
      name: 'Acme',
      slug: 'acme',
      ownerUserId: 'owner-1',
    });

    await memberRepo.save(
      Member.create({
        id: 'mem-guest',
        organizationId: org.id,
        userId: 'guest-1',
        role: Role.Guest,
      }),
    );

    await expect(
      inviteMemberUseCase.execute({
        organizationId: org.id,
        userId: 'new-user',
        role: Role.Member,
        requesterUserId: 'guest-1',
      }),
    ).rejects.toThrow('User is not authorized to invite members');
  });
});

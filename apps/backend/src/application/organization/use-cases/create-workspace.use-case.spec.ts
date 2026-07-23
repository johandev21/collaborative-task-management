import { InMemoryOrganizationRepository } from '../../../infrastructure/persistence/in-memory/in-memory-organization.repository';
import { InMemoryWorkspaceRepository } from '../../../infrastructure/persistence/in-memory/in-memory-workspace.repository';
import { InMemoryMemberRepository } from '../../../infrastructure/persistence/in-memory/in-memory-member.repository';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { CreateWorkspaceUseCase } from './create-workspace.use-case';
import { Role } from '../../../domain/organization/models/role.enum';
import { Member } from '../../../domain/organization/models/member.entity';

describe('CreateWorkspaceUseCase', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let workspaceRepo: InMemoryWorkspaceRepository;
  let memberRepo: InMemoryMemberRepository;
  let createOrgUseCase: CreateOrganizationUseCase;
  let createWorkspaceUseCase: CreateWorkspaceUseCase;

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
  });

  it('should allow Organization Owner to create a workspace', async () => {
    const org = await createOrgUseCase.execute({
      name: 'Acme',
      slug: 'acme',
      ownerUserId: 'owner-1',
    });

    const workspace = await createWorkspaceUseCase.execute({
      organizationId: org.id,
      name: 'Engineering',
      slug: 'engineering',
      requesterUserId: 'owner-1',
    });

    expect(workspace.id).toBeDefined();
    expect(workspace.organizationId).toBe(org.id);
    expect(workspace.name).toBe('Engineering');
    expect(workspace.slug).toBe('engineering');
  });

  it('should throw an error if organization does not exist', async () => {
    await expect(
      createWorkspaceUseCase.execute({
        organizationId: 'non-existent-org',
        name: 'Engineering',
        slug: 'engineering',
        requesterUserId: 'owner-1',
      }),
    ).rejects.toThrow('Organization not found');
  });

  it('should throw an error if requester is not an Owner or Admin', async () => {
    const org = await createOrgUseCase.execute({
      name: 'Acme',
      slug: 'acme',
      ownerUserId: 'owner-1',
    });

    // Add a regular member
    await memberRepo.save(
      Member.create({
        id: 'mem-2',
        organizationId: org.id,
        userId: 'member-2',
        role: Role.Member,
      }),
    );

    await expect(
      createWorkspaceUseCase.execute({
        organizationId: org.id,
        name: 'Engineering',
        slug: 'engineering',
        requesterUserId: 'member-2',
      }),
    ).rejects.toThrow('User is not authorized to create a workspace');
  });

  it('should throw an error if workspace slug is duplicated within the organization', async () => {
    const org = await createOrgUseCase.execute({
      name: 'Acme',
      slug: 'acme',
      ownerUserId: 'owner-1',
    });

    await createWorkspaceUseCase.execute({
      organizationId: org.id,
      name: 'Engineering',
      slug: 'engineering',
      requesterUserId: 'owner-1',
    });

    await expect(
      createWorkspaceUseCase.execute({
        organizationId: org.id,
        name: 'Engineering 2',
        slug: 'engineering',
        requesterUserId: 'owner-1',
      }),
    ).rejects.toThrow(
      'Workspace with this slug already exists in the organization',
    );
  });
});

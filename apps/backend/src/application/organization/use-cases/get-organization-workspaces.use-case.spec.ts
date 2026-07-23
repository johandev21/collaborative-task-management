import { InMemoryOrganizationRepository } from '../../../infrastructure/persistence/in-memory/in-memory-organization.repository';
import { InMemoryWorkspaceRepository } from '../../../infrastructure/persistence/in-memory/in-memory-workspace.repository';
import { InMemoryMemberRepository } from '../../../infrastructure/persistence/in-memory/in-memory-member.repository';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { CreateWorkspaceUseCase } from './create-workspace.use-case';
import { GetOrganizationWorkspacesUseCase } from './get-organization-workspaces.use-case';

describe('GetOrganizationWorkspacesUseCase', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let workspaceRepo: InMemoryWorkspaceRepository;
  let memberRepo: InMemoryMemberRepository;
  let createOrgUseCase: CreateOrganizationUseCase;
  let createWorkspaceUseCase: CreateWorkspaceUseCase;
  let getWorkspacesUseCase: GetOrganizationWorkspacesUseCase;

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
    getWorkspacesUseCase = new GetOrganizationWorkspacesUseCase(
      workspaceRepo,
      memberRepo,
    );
  });

  it('should strictly return workspaces belonging ONLY to the requested Organization context', async () => {
    const org1 = await createOrgUseCase.execute({
      name: 'Org One',
      slug: 'org-one',
      ownerUserId: 'user-1',
    });

    const org2 = await createOrgUseCase.execute({
      name: 'Org Two',
      slug: 'org-two',
      ownerUserId: 'user-2',
    });

    await createWorkspaceUseCase.execute({
      organizationId: org1.id,
      name: 'Org1 Frontend',
      slug: 'org1-frontend',
      requesterUserId: 'user-1',
    });

    await createWorkspaceUseCase.execute({
      organizationId: org2.id,
      name: 'Org2 Backend',
      slug: 'org2-backend',
      requesterUserId: 'user-2',
    });

    const org1Workspaces = await getWorkspacesUseCase.execute({
      organizationId: org1.id,
      requesterUserId: 'user-1',
    });

    expect(org1Workspaces).toHaveLength(1);
    expect(org1Workspaces[0].name).toBe('Org1 Frontend');
  });

  it('should deny access if requester is not a member of the organization', async () => {
    const org1 = await createOrgUseCase.execute({
      name: 'Org One',
      slug: 'org-one',
      ownerUserId: 'user-1',
    });

    await expect(
      getWorkspacesUseCase.execute({
        organizationId: org1.id,
        requesterUserId: 'outsider-user',
      }),
    ).rejects.toThrow('User is not a member of this organization');
  });
});

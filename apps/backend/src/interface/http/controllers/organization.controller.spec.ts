import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { OrganizationModule } from '../../../organization.module';
import { Role } from '../../../domain/organization/models/role.enum';

describe('OrganizationController (Integration)', () => {
  let controller: OrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrganizationModule],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
  });

  it('should create an organization, workspace, invite member, and retrieve workspaces', async () => {
    // 1. Create Organization
    const org = await controller.createOrganization({
      name: 'Stark Industries',
      slug: 'stark-industries',
      ownerUserId: 'tony-stark',
    });

    expect(org.id).toBeDefined();
    expect(org.slug).toBe('stark-industries');
    expect(org.ownerId).toBe('tony-stark');

    // 2. Create Workspace
    const workspace = await controller.createWorkspace(org.id, {
      name: 'Avenger Tech',
      slug: 'avenger-tech',
      requesterUserId: 'tony-stark',
    });

    expect(workspace.id).toBeDefined();
    expect(workspace.organizationId).toBe(org.id);
    expect(workspace.name).toBe('Avenger Tech');

    // 3. Invite Member to Org / Workspace
    const member = await controller.inviteMember(org.id, {
      workspaceId: workspace.id,
      userId: 'peter-parker',
      role: Role.Member,
      requesterUserId: 'tony-stark',
    });

    expect(member.id).toBeDefined();
    expect(member.role).toBe(Role.Member);

    // 4. Get Workspaces for Organization
    const workspaces = await controller.getWorkspaces(org.id, 'tony-stark');
    expect(workspaces).toHaveLength(1);
    expect(workspaces[0].name).toBe('Avenger Tech');
  });

  it('should enforce permission checks on workspace creation', async () => {
    const org = await controller.createOrganization({
      name: 'Wayne Enterprises',
      slug: 'wayne-ent',
      ownerUserId: 'bruce-wayne',
    });

    await expect(
      controller.createWorkspace(org.id, {
        name: 'Secret Cave',
        slug: 'secret-cave',
        requesterUserId: 'unauthorized-user',
      }),
    ).rejects.toThrow('User is not authorized to create a workspace');
  });
});

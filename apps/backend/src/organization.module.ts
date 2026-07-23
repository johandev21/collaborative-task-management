import { Module } from '@nestjs/common';
import { OrganizationController } from './interface/http/controllers/organization.controller';
import { InMemoryOrganizationRepository } from './infrastructure/persistence/in-memory/in-memory-organization.repository';
import { InMemoryWorkspaceRepository } from './infrastructure/persistence/in-memory/in-memory-workspace.repository';
import { InMemoryMemberRepository } from './infrastructure/persistence/in-memory/in-memory-member.repository';
import { CreateOrganizationUseCase } from './application/organization/use-cases/create-organization.use-case';
import { CreateWorkspaceUseCase } from './application/organization/use-cases/create-workspace.use-case';
import { InviteMemberUseCase } from './application/organization/use-cases/invite-member.use-case';
import { GetOrganizationWorkspacesUseCase } from './application/organization/use-cases/get-organization-workspaces.use-case';

const orgRepo = new InMemoryOrganizationRepository();
const workspaceRepo = new InMemoryWorkspaceRepository();
const memberRepo = new InMemoryMemberRepository();

@Module({
  controllers: [OrganizationController],
  providers: [
    {
      provide: 'OrganizationRepositoryPort',
      useValue: orgRepo,
    },
    {
      provide: 'WorkspaceRepositoryPort',
      useValue: workspaceRepo,
    },
    {
      provide: 'MemberRepositoryPort',
      useValue: memberRepo,
    },
    {
      provide: 'CreateOrganizationUseCase',
      useFactory: () => new CreateOrganizationUseCase(orgRepo, memberRepo),
    },
    {
      provide: 'CreateWorkspaceUseCase',
      useFactory: () =>
        new CreateWorkspaceUseCase(orgRepo, workspaceRepo, memberRepo),
    },
    {
      provide: 'InviteMemberUseCase',
      useFactory: () =>
        new InviteMemberUseCase(orgRepo, workspaceRepo, memberRepo),
    },
    {
      provide: 'GetOrganizationWorkspacesUseCase',
      useFactory: () =>
        new GetOrganizationWorkspacesUseCase(workspaceRepo, memberRepo),
    },
  ],
  exports: [
    'OrganizationRepositoryPort',
    'WorkspaceRepositoryPort',
    'MemberRepositoryPort',
  ],
})
export class OrganizationModule {}

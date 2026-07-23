import { Member } from '../models/member.entity';

export interface MemberRepositoryPort {
  save(member: Member): Promise<Member>;
  findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<Member | null>;
  findByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<Member | null>;
  listByOrganization(organizationId: string): Promise<Member[]>;
  listByWorkspace(workspaceId: string): Promise<Member[]>;
}

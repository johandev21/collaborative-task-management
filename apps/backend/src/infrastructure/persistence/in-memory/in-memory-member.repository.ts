import { Member } from '../../../domain/organization/models/member.entity';
import { MemberRepositoryPort } from '../../../domain/organization/ports/member.repository.port';

export class InMemoryMemberRepository implements MemberRepositoryPort {
  private members: Map<string, Member> = new Map();

  async save(member: Member): Promise<Member> {
    this.members.set(member.id, member);
    return member;
  }

  async findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<Member | null> {
    for (const m of this.members.values()) {
      if (m.organizationId === organizationId && m.userId === userId) {
        return m;
      }
    }
    return null;
  }

  async findByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<Member | null> {
    for (const m of this.members.values()) {
      if (m.workspaceId === workspaceId && m.userId === userId) {
        return m;
      }
    }
    return null;
  }

  async listByOrganization(organizationId: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (m) => m.organizationId === organizationId,
    );
  }

  async listByWorkspace(workspaceId: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (m) => m.workspaceId === workspaceId,
    );
  }

  clear(): void {
    this.members.clear();
  }
}

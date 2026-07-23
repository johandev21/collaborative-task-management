import { Role } from './role.enum';

export class Member {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly role: Role,
    public readonly workspaceId?: string | null,
    public readonly joinedAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    organizationId: string;
    userId: string;
    role: Role;
    workspaceId?: string | null;
  }): Member {
    return new Member(
      params.id,
      params.organizationId,
      params.userId,
      params.role,
      params.workspaceId ?? null,
    );
  }
}

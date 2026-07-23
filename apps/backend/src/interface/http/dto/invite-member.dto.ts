import { Role } from '../../../domain/organization/models/role.enum';

export class InviteMemberDto {
  workspaceId?: string;
  userId!: string;
  role!: Role;
  requesterUserId!: string;
}

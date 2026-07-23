import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../../domain/organization/models/role.enum';

export class InviteMemberDto {
  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(Role, {
    message: 'Role must be one of: Owner, Admin, Member, Guest',
  })
  role!: Role;

  @IsString()
  @IsNotEmpty()
  requesterUserId!: string;
}

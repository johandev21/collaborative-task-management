import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { CreateOrganizationUseCase } from '../../../application/organization/use-cases/create-organization.use-case';
import { CreateWorkspaceUseCase } from '../../../application/organization/use-cases/create-workspace.use-case';
import { InviteMemberUseCase } from '../../../application/organization/use-cases/invite-member.use-case';
import { GetOrganizationWorkspacesUseCase } from '../../../application/organization/use-cases/get-organization-workspaces.use-case';

@Controller('organizations')
export class OrganizationController {
  constructor(
    @Inject('CreateOrganizationUseCase')
    private readonly createOrgUseCase: CreateOrganizationUseCase,
    @Inject('CreateWorkspaceUseCase')
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    @Inject('InviteMemberUseCase')
    private readonly inviteMemberUseCase: InviteMemberUseCase,
    @Inject('GetOrganizationWorkspacesUseCase')
    private readonly getWorkspacesUseCase: GetOrganizationWorkspacesUseCase,
  ) {}

  @Post()
  async createOrganization(@Body() dto: CreateOrganizationDto) {
    try {
      return await this.createOrgUseCase.execute({
        name: dto.name,
        slug: dto.slug,
        ownerUserId: dto.ownerUserId,
      });
    } catch (err: any) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':orgId/workspaces')
  async createWorkspace(
    @Param('orgId') orgId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    try {
      return await this.createWorkspaceUseCase.execute({
        organizationId: orgId,
        name: dto.name,
        slug: dto.slug,
        requesterUserId: dto.requesterUserId,
      });
    } catch (err: any) {
      if (err.message.includes('not authorized')) {
        throw new HttpException(err.message, HttpStatus.FORBIDDEN);
      }
      if (err.message.includes('not found')) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':orgId/workspaces')
  async getWorkspaces(
    @Param('orgId') orgId: string,
    @Headers('x-user-id') requesterUserId: string,
  ) {
    try {
      if (!requesterUserId) {
        throw new HttpException(
          'Missing x-user-id header',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return await this.getWorkspacesUseCase.execute({
        organizationId: orgId,
        requesterUserId,
      });
    } catch (err: any) {
      if (err.message.includes('not a member')) {
        throw new HttpException(err.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':orgId/members/invite')
  async inviteMember(
    @Param('orgId') orgId: string,
    @Body() dto: InviteMemberDto,
  ) {
    try {
      return await this.inviteMemberUseCase.execute({
        organizationId: orgId,
        workspaceId: dto.workspaceId,
        userId: dto.userId,
        role: dto.role,
        requesterUserId: dto.requesterUserId,
      });
    } catch (err: any) {
      if (err.message.includes('not authorized')) {
        throw new HttpException(err.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}

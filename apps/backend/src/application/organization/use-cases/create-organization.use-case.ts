import { Organization } from '../../../domain/organization/models/organization.entity';
import { Member } from '../../../domain/organization/models/member.entity';
import { Role } from '../../../domain/organization/models/role.enum';
import { OrganizationRepositoryPort } from '../../../domain/organization/ports/organization.repository.port';
import { MemberRepositoryPort } from '../../../domain/organization/ports/member.repository.port';

export interface CreateOrganizationCommand {
  name: string;
  slug: string;
  ownerUserId: string;
}

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    const existingSlug = await this.organizationRepository.findBySlug(
      command.slug,
    );
    if (existingSlug) {
      throw new Error('Organization with this slug already exists');
    }

    const orgId = `org-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const organization = Organization.create({
      id: orgId,
      name: command.name,
      slug: command.slug,
      ownerId: command.ownerUserId,
    });

    const savedOrg = await this.organizationRepository.save(organization);

    const memberId = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const ownerMember = Member.create({
      id: memberId,
      organizationId: savedOrg.id,
      userId: command.ownerUserId,
      role: Role.Owner,
    });

    await this.memberRepository.save(ownerMember);

    return savedOrg;
  }
}

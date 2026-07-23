import { InMemoryOrganizationRepository } from '../../../infrastructure/persistence/in-memory/in-memory-organization.repository';
import { InMemoryMemberRepository } from '../../../infrastructure/persistence/in-memory/in-memory-member.repository';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { Role } from '../../../domain/organization/models/role.enum';

describe('CreateOrganizationUseCase', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let memberRepo: InMemoryMemberRepository;
  let useCase: CreateOrganizationUseCase;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    memberRepo = new InMemoryMemberRepository();
    useCase = new CreateOrganizationUseCase(orgRepo, memberRepo);
  });

  it('should create an organization and set the creator as Owner', async () => {
    const result = await useCase.execute({
      name: 'Acme Corp',
      slug: 'acme-corp',
      ownerUserId: 'user-123',
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Acme Corp');
    expect(result.slug).toBe('acme-corp');
    expect(result.ownerId).toBe('user-123');

    const member = await memberRepo.findByOrganizationAndUser(
      result.id,
      'user-123',
    );
    expect(member).not.toBeNull();
    expect(member?.role).toBe(Role.Owner);
  });

  it('should throw an error if slug is already taken', async () => {
    await useCase.execute({
      name: 'Acme Corp',
      slug: 'acme-corp',
      ownerUserId: 'user-123',
    });

    await expect(
      useCase.execute({
        name: 'Acme Duplicate',
        slug: 'acme-corp',
        ownerUserId: 'user-456',
      }),
    ).rejects.toThrow('Organization with this slug already exists');
  });

  it('should throw an error if slug format is invalid', async () => {
    await expect(
      useCase.execute({
        name: 'Invalid Org',
        slug: 'Invalid Slug!',
        ownerUserId: 'user-123',
      }),
    ).rejects.toThrow('Invalid organization slug format');
  });
});

export class Organization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly ownerId: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
  }): Organization {
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(params.slug)) {
      throw new Error('Invalid organization slug format');
    }
    if (!params.name.trim()) {
      throw new Error('Organization name cannot be empty');
    }
    return new Organization(
      params.id,
      params.name.trim(),
      params.slug.toLowerCase(),
      params.ownerId,
    );
  }
}

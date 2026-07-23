export class Workspace {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
  }): Workspace {
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(params.slug)) {
      throw new Error('Invalid workspace slug format');
    }
    if (!params.name.trim()) {
      throw new Error('Workspace name cannot be empty');
    }
    return new Workspace(
      params.id,
      params.organizationId,
      params.name.trim(),
      params.slug.toLowerCase(),
    );
  }
}

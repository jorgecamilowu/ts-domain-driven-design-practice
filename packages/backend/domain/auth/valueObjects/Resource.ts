type ResourceName = "task";
type AccountId = number;

export type ResourceString = `${AccountId}.${ResourceName}`;

export class Resource {
  constructor(
    public readonly accountId: AccountId,
    public readonly name: ResourceName
  ) {}

  static fromResourceString(resource: ResourceString): Resource {
    const [accountId, name] = resource.split(".") as [
      `${AccountId}`,
      ResourceName
    ];

    return new Resource(Number.parseInt(accountId), name);
  }
}

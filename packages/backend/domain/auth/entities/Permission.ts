import { PermissionType } from "../valueObjects/PermissionType";
import { Resource } from "../valueObjects/Resource";

export class Permission {
  constructor(
    public readonly id: number,
    public readonly type: PermissionType,
    public readonly resource: Resource
  ) {}

  static getDefaultPermissions(accountId: number): {
    type: PermissionType;
    resource: Resource;
  }[] {
    return [
      {
        type: PermissionType.READ_AND_WRITE,
        resource: new Resource(accountId, "task"),
      },
    ];
  }
}

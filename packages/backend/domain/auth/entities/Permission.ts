import type { Resource } from "../valueObjects/Resource";

export interface Permission {
  readonly id: number;
  readonly type: "read" | "write" | "readAndWrite";
  readonly resource: Resource;
}

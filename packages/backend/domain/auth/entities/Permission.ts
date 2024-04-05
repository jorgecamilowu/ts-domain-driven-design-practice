export interface Permission {
  readonly id: number;
  type: "read" | "write" | "readAndWrite";
  resource: string;
}

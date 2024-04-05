import { Priority } from "../valueObjects/Priority";

export class Task {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string,
    public dueDate: Date,
    public priority: Priority,
    public completed: boolean,
    public readonly createdAt: Date,
    public readonly accountId: number | null
  ) {}

  markAsCompleted(): void {
    this.completed = true;
  }

  markAsPending(): void {
    this.completed = false;
  }

  updateDetails(
    details: Partial<
      Omit<
        Task,
        | "id"
        | "createdAt"
        | "markAsCompleted"
        | "markAsPending"
        | "updateDetails"
      >
    >
  ) {
    Object.assign(this, details);
  }
}

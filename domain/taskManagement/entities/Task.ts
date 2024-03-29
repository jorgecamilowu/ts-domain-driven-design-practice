import { Priority } from "../valueObjects/Priority";

export class Task {
  constructor(
    private readonly id: string,
    public title: string,
    public description: string,
    public dueDate: Date,
    public priority: Priority,
    public completed: boolean
  ) {}

  markAsCompleted(): void {
    this.completed = true;
  }

  markAsPending(): void {
    this.completed = false;
  }

  updateDetails(
    details: Partial<
      Omit<Task, "id" | "markAsCompleted" | "markAsPending" | "updateDetails">
    >
  ) {
    Object.assign(this, details);
  }
}

import { Phase } from "./phase.model";

export class Program {
    id: string;
    createdAt: number;
    userId: string;
    completed: boolean;
    instruction: Phase[];
    title: string;
    notes: string;
  }
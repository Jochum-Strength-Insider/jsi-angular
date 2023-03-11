import { Phase } from "./phase.model";

export class Workout {
    id: string;
    createdAt: number;
    userId: string;
    completed: boolean;
    instruction: Phase[];
    title: string;
    notes: string;
    parentFolderId: string;
  }
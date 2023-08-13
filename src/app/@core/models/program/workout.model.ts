import { IInstruction } from "./instructions.interface";

export class Workout {
    id: string;
    createdAt: number;
    instruction: IInstruction;
    completed: boolean = false;
    title: string;
    notes: string;
  }
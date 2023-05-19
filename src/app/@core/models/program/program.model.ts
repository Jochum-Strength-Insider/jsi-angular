import { Phase } from "./phase.model";

export class Day {
  exercises: string;
  image: string;
  title: string;
}

export class Program {
    id: string;
    createdAt: number;
    userId: string;
    instruction: {
      [phase: string]:
      {
        [day: string]: Day
      }
    }
    title: string;
    notes: string;
  }
import { Tracking } from "./tracking.model";

export class Exercise {
    id: string;
    createdAt: number;
    number: string;
    description: string;
    link: string;
    sets: string;
    reps: string;
    tempo: string;
    tracking: Tracking;
  }
  
import { Tracking } from "./tracking.model";

export class Exercise {
    id: string;
    createdAt: number;
    Number: string;
    Description: string;
    Link: string;
    Sets: string;
    Reps: string;
    Rest: string;
    Tempo: string;
    tracking: Tracking;
  }

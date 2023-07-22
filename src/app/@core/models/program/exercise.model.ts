import { Tracking } from "./tracking.model";

export class Exercise {
    Number: string;
    Description: string;
    Link: string;
    Sets: string;
    Reps: string;
    Rest: string;
    Tempo: string;
    tracking: Tracking;
  }

export type ExerciseKeys = keyof Exercise;
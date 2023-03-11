import { Exercise } from "./exercise.model";

export class Day {
    id: string;
    title: string;
    dayTitle: string;
    image: string;
    exercises: Exercise[];
}
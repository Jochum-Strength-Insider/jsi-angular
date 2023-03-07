import { Day } from "./day.model";

export class Phase {
    id: string;
    title: string;
    days: Day[];
    completed: boolean;
}
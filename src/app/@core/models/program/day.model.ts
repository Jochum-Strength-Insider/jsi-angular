import { Exercise } from "./exercise.model";

export class Day {
    id: string;
    title: string;
    image: string;
    exercises: Exercise[] = [];

    constructor(
        id: string = "",
        title: string = "",
        image: string = "",
    ) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.exercises = [];
    }
}

export const IMAGE_OPTIONS: Array<{value: string, title: string }> = [
    { value: "max-upper", title: "Max Upper" },
    { value: "max-lower", title: "Max Lower" },
    { value: "dynamic-upper", title: "Dynamic Upper" },
    { value: "dynamic-lower", title: "Dynamic Lower" },
    { value: "hypertrophy-upper", title: "Hypertrophy Upper" },
    { value: "hypertrophy-lower", title: "Hypertrophy Lower" },
    { value: "full-1", title: "Full Body 1" },
    { value: "full-2", title: "Full Body 2" },
    { value: "full-3", title: "Full Body 3" },
    { value: "full-4", title: "Full Body 4" },
    { value: "recovery-1", title: "Recovery 1" },
    { value: "recovery-2", title: "Recovery 2" },
    { value: "recovery-3", title: "Recovery 3" },
    { value: "rest", title: "Rest" }
  ];
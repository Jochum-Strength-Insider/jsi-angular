import { ExerciseKeys } from "./exercise.model";

export class ProgramCell {
    dayIndex: number;
    rowIndex: number;
    name: ExerciseKeys;
    number: string;
    value: string;

    constructor(
        dayIndex: number = 0,
        rowIndex: number = 0,
        name: ExerciseKeys = 'Number',
        number: string = '1A',
        value: string = ''
    ) {
        this.dayIndex = dayIndex;
        this.rowIndex = rowIndex;
        this.name = name;
        this.number = number;
        this.value = value;
    }
}
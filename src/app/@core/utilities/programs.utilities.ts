import { Day } from "../models/program/day.model";
import { IInstruction } from "../models/program/instructions.interface";
import { Phase } from "../models/program/phase.model";
import { Program } from "../models/program/program.model";
import { Workout } from "../models/program/workout.model";

export function mapPhaseArrayToObject(phase: Phase, clearTracking: boolean = false): any {
    const daysListJSON = phase.days.reduce((accumulator, day) => {
        const { title, exercises, image } = day;

        if(clearTracking){
          exercises.forEach( exercise => {
            exercise.tracking['week 1'] = "";
            exercise.tracking['week 2'] = "";
            exercise.tracking['week 3'] = "";
          })
        }

        const dayObject = {
          image,
          title,
          exercises: JSON.stringify(exercises)
        };
        return ({ ...accumulator, [day.id]: dayObject })
    }, {});
    return { ...daysListJSON }
  }

export function mapWorkoutToPhases(program: Workout | Program): Phase[] {
    const { instruction } = program;
    const phasesList: string[] = Object.keys(program.instruction);
    const phaseArray = phasesList.map((key: string) => {
        const { completed, ...days } = instruction[key];
        const daysArray: Day[] = Object.keys(days).map((key) => {
            const { exercises, title, image } = days[key];
            return ({
            id: key,
            title,
            image,
            exercises: JSON.parse(exercises)
            });
        });
        return ({ title: key, days: daysArray })
    });
    return phaseArray;
}

export function programObjectFromProgram(program: Program): any {
    const { id, instruction, title, notes } = program;
    const programObject: any = {};
    programObject['title'] = title;
    programObject['createdAt'] = new Date().getTime();
    programObject['notes'] = notes;
    programObject['instruction'] = stringifyInstructions(instruction, true);
    return programObject;
}

export function stringifyInstructions(instruction: IInstruction, clearTracking: boolean = false): any {
    const phasesList = Object.keys(instruction);
    // Reduce program object into days
    const tablesList = phasesList.reduce((accumulator, key) => {
        const { completed, ...table } = instruction[key];
        const daysListArray = Object.keys(table);

        // reduce days objects back into parsed JSON
        const daysList = daysListArray.reduce((accumulator, key) => {

            const { exercises, title, image } = table[key];

            let exercisesUpdate = JSON.parse(exercises);
            if(clearTracking) {
            exercisesUpdate = JSON.parse(exercises).map((exercise: any) => {
                const exerciseUpdate = { ...exercise };
                exerciseUpdate['tracking'] = { "week 1": "", "week 2": "", "week 3": "" }
                return exerciseUpdate;
            });
            }

            const day = {
                exercises: JSON.stringify(exercisesUpdate),
                title,
                image
            }

            return (
                { ...accumulator, [key]: day }
            )
        }, {});

        return (
            { ...accumulator, [key]: daysList }
        )
    }, {});

    return tablesList;
}
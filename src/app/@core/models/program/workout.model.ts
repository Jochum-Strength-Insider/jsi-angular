import { Phase } from "./phase.model";

export class WorkoutListItem {
  id: string;
  active: boolean;
  createdAt: string;
  title: string;
}

interface IInstruction {
  [phase: string]:
  {
    [day: string]:
    {
      exercises: string;
      image: string;
      title: string;
    };
  }
}

export class Workout {
    id: string;
    createdAt: number;
    userId: string;
    instruction: IInstruction;
    instructionArray?: Phase[];
    completed: boolean;
    title: string;
    notes: string;
    parentFolderId: string;
  }

  export class WorkoutWithPhaseArray extends Workout {
    phases?: Phase[];
  }
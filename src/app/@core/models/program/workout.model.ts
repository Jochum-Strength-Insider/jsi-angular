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
    instruction: IInstruction;
    completed: boolean;
    title: string;
    notes: string;
  }
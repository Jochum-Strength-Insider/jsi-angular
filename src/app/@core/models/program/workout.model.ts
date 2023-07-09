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
    completed: boolean;
    title: string;
    notes: string;
    parentFolderId: string;
  }
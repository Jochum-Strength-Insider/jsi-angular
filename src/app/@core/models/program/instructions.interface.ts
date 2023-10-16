export interface IInstruction {
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
export class WorkoutId {
    id: string;
    createdAt: number;
    title: string;
    active: boolean;

    constructor(title: string, createdAt: number | null = null){
      this.createdAt = createdAt || new Date().getTime();
      this.title = title;
      this.active = false;
    }
}
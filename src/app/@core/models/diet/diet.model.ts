import { Meal } from "./meal.model"

export class Diet {
    id: string;
    createdAt: number;
    meals: Meal;
    rating: number;
}
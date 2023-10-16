import { Meals } from "./meal.model"

export class Diet {
    id: string;
    createdAt: number;
    meals: Meals;
    rating: number = 0;

    constructor(createdAt: number = new Date().getTime()){
        this.createdAt = createdAt;
        this.meals = new Meals();
    }
}
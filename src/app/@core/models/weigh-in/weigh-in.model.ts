export class WeighIn {
    id?: string;
    date: number;
    weight: number;

    constructor(date: number, weight: number){
        this.date = date;
        this.weight = weight;
    }
}
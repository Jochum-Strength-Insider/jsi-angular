export class Folder {
    id: string;
    createdAt: number;
    title: string;

    constructor(title: string = ""){
        this.createdAt = new Date().getTime();
        this.title = title;
    }
}
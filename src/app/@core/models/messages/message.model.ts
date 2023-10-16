export class Message {
    id: string;
    createdAt: number;
    username: string;
    text: string;
    userId: string;

    constructor(text: string, userId: string, username: string){
      this.createdAt = new Date().getTime();
      this.text = text.trim();
      this.userId = userId;
      this.username = username;
    }
  }
  
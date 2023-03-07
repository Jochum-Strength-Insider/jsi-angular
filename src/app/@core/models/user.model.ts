import { Message } from "./message.model"

export class User {
    active: boolean;
    isAdmin: boolean;
    roles: string[];
    adminUnread: boolean;
    id: string;
    createdAt: number;
    email: string;
    username: string;
    programDate: number;
    unread: Message;
}
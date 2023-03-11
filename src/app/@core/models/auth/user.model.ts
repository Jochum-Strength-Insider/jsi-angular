import { Message } from "../program/workout-id.model";

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
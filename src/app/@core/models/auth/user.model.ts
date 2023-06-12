import { Message } from "../messages/message.model";

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
    emailVerified: boolean;
    ACTIVE: boolean;
    ADMIN: boolean;
}

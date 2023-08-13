import { Message } from "../messages/message.model";

export class User {
    id: string;
    active: boolean;
    isAdmin: boolean;
    roles: string[];
    adminUnread: boolean;
    createdAt: number;
    email: string;
    username: string;
    programDate: number;
    unread: Message;
    emailVerified: boolean;
    ACTIVE: boolean;
    ADMIN: boolean;
}

export class UserWithSelection extends User {
    checked?: boolean = false;
}

export type UserKeys = keyof User;
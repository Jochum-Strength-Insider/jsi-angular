export class User {
    id: string;
    createdAt: number;
    email: string;
    username: string;
    programDate: number;
    emailVerified: boolean;
    surveySubmitted: boolean;
    ACTIVE: boolean;
    ADMIN: boolean;
    billingId: string;
}

export class UserWithSelection extends User {
    checked?: boolean = false;
}

export type UserKeys = keyof User;
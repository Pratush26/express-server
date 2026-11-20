export interface IUser {
    name: string;
    email: string;
    password: string;
    age: number | null;
}
export interface IUserRecord extends IUser {
    id: number;
    role: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

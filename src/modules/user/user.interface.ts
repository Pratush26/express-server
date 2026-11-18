export interface IUser {
    name: string;
    email: string;
    password: string;
    age: Number;
}
export interface IUserRecord extends IUser {
    id: Number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

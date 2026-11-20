export interface IProfile {
    userId: string | number;
    bio: string;
    address: string;
    phone: string;
    links?: string[];
}
export interface IProfileRecord extends IProfile {
    id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

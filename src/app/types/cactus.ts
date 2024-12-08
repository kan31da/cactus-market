import { User } from "./user";

export interface Cactus {
    _id: string;
    cactusName: string;
    description: string;
    price: number;
    user: User;
}
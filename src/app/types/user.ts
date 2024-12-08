import { Cactus } from "./cactus";

export interface User {
    email: string;
    username: string;   
    cactuses: Cactus[];
    _id: string;
}

export interface UserForAuth {
    email: string;     
}
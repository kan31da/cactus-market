import { Cactus } from "./cactus";

export interface Cart {
    _id: string;
    uid: string;
    cactuses: Cactus[];
}
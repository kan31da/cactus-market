import { Cactus } from "./cactus";
import { Cart } from "./cart";

export interface User {
    _id: string;
    email: string;
    username: string;
    cactuses: Cactus[];
    cart: Cart;
}

export interface UserForAuth {
    email: string;
}
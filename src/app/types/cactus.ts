import { Review } from "./review";

export interface Cactus {
    _id: string;
    cactusName: string;
    description: string;
    shortDescription: string;
    image: string;
    price: number;
    userId: string;
    quantity: number;
    reviews: Review[]
}
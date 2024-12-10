import { Timestamp } from "@angular/fire/firestore";

export interface Review {
    _id: string;
    name: string;
    email: string;
    review: string;
    date: Timestamp;
}
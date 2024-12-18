import { Injectable } from '@angular/core';
import { Review } from '../types/review';
import { from, map, Observable } from 'rxjs';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private reviewsCollectionName = 'reviews';

    constructor(private firestore: Firestore) { }

    getReviews(): Observable<Review[]> {
        const reviewsRef = collection(this.firestore, this.reviewsCollectionName);
        return collectionData(reviewsRef, { idField: '_id' }) as Observable<Review[]>;
    }

    getReviewById(id: string): Observable<Review> {
        const reviewDocRef = doc(this.firestore, `${this.reviewsCollectionName}/${id}`);
        return docData(reviewDocRef, { idField: '_id' }) as Observable<Review>;
    }

    getReviewsByCactusId(cactusId: string): Observable<Review[]> {
        const reviewsCollection = collection(this.firestore, this.reviewsCollectionName);
        const reviewQuery = query(reviewsCollection, where('cactusId', '==', cactusId));
        return collectionData(reviewQuery, { idField: 'cactusId' }) as Observable<Review[]>;
    }

    createReview(review: Omit<Review, '_id'>): Observable<string> {
        const reviewsCollection = collection(this.firestore, this.reviewsCollectionName);
        const reviewsRef = doc(reviewsCollection);
        return from(addDoc(reviewsCollection, { ...review, _id: reviewsRef.id, }))
            .pipe(map(data => data.id));
    }

    addReview(review: Review): Observable<string> {
        const reviewsCollection = collection(this.firestore, this.reviewsCollectionName);
        const reviewsRef = doc(reviewsCollection);
        return from(setDoc(reviewsRef, { ...review, _id: reviewsRef.id, }))
            .pipe(map(() => reviewsRef.id));
    }

    updateReview(id: string, data: Partial<Review>): Observable<void> {
        const reviewDocRef = doc(this.firestore, `${this.reviewsCollectionName}/${id}`);
        return from(updateDoc(reviewDocRef, data));
    }

    deleteReview(id: string): Observable<void> {
        const reviewDocRef = doc(this.firestore, `${this.reviewsCollectionName}/${id}`);
        return from(deleteDoc(reviewDocRef));
    }
}
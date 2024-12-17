import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Cactus } from '../types/cactus';
import { from, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CactusService {
    private cactusesCollectionName = 'cactuses';

    constructor(private firestore: Firestore) { }

    createCactus(cactus: Cactus): Observable<string | undefined> {
        const cactusesCollection = collection(this.firestore, this.cactusesCollectionName);
        const cactusRef = doc(cactusesCollection);
        return from(setDoc(cactusRef, { ...cactus, _id: cactusRef.id })).pipe(
            map(() => cactusRef.id),
        );
    }

    getCactusByUserID(userId: string): Observable<Cactus[]> {
        const cactusesCollection = collection(this.firestore, this.cactusesCollectionName);
        const cactusQuery = query(cactusesCollection, where('userId', '==', userId));
        return collectionData(cactusQuery, { idField: 'userId' }) as Observable<Cactus[]>;
    }

    getCactuses(): Observable<Cactus[]> {
        const cactusesCollection = collection(this.firestore, this.cactusesCollectionName);
        return collectionData(cactusesCollection, { idField: '_id' }) as Observable<Cactus[]>;
    }

    getCactusById(cactusId: string): Observable<Cactus | undefined> {
        const cactusDocRef = doc(this.firestore, `${this.cactusesCollectionName}/${cactusId}`);
        return from(getDoc(cactusDocRef)).pipe(
            map(cactusSnapshot => cactusSnapshot.exists() ? (cactusSnapshot.data() as Cactus) : undefined)
        );
    }

    updateCactus(cactusId: string, updatedCactus: Partial<Cactus>): Observable<void> {
        const cactusDocRef = doc(this.firestore, `${this.cactusesCollectionName}/${cactusId}`);
        return from(updateDoc(cactusDocRef, updatedCactus));
    }

    deleteCactus(cactusId: string): Observable<void> {
        const cactusDocRef = doc(this.firestore, `${this.cactusesCollectionName}/${cactusId}`);
        return from(deleteDoc(cactusDocRef));
    }
}
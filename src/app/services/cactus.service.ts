import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Cactus } from '../types/cactus';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CactusService {
    // cactuses: Cactus[] = [];

    private cactusesCollectionName = 'cactuses';

    constructor(private firestore: Firestore) { }


    async createCactus(cactus: Cactus): Promise<string> {
        const cactusesCollection = collection(this.firestore, this.cactusesCollectionName);
        const cactusRef = doc(cactusesCollection);
        await setDoc(cactusRef, {
            ...cactus,
            _id: cactusRef.id,
        });
        return cactusRef.id;
    }

    getCactusByUserID(userID: string): Observable<Cactus[]> {
        const cactusesCollection = collection(this.firestore, this.cactusesCollectionName);
        const cactusQuery = query(cactusesCollection, where('userID', '==', userID));
        return collectionData(cactusQuery, { idField: 'userID' }) as Observable<Cactus[]>;
    }

    getCactuses(): Observable<Cactus[]> {
        const cactusesCollection = collection(this.firestore, this.cactusesCollectionName);
        return collectionData(cactusesCollection, { idField: '_id' }) as Observable<Cactus[]>;
    }

    async getCactusById(cactusId: string): Promise<Cactus | undefined> {
        const cactusDocRef = doc(this.firestore, `${this.cactusesCollectionName}/${cactusId}`);
        const cactusSnapshot = await getDoc(cactusDocRef);
        return cactusSnapshot.exists() ? (cactusSnapshot.data() as Cactus) : undefined;
    }

    async updateCactus(cactusId: string, updatedCactus: Partial<Cactus>): Promise<void> {
        const cactusDocRef = doc(this.firestore, `${this.cactusesCollectionName}/${cactusId}`);
        await updateDoc(cactusDocRef, updatedCactus);
    }

    async deleteCactus(cactusId: string): Promise<void> {
        const cactusDocRef = doc(this.firestore, `${this.cactusesCollectionName}/${cactusId}`);
        await deleteDoc(cactusDocRef);
    }
}
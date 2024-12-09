import { Injectable, signal } from '@angular/core';
import { User } from '../types/user';
import { Observable } from 'rxjs';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // users: User[] = [];

    private usersCollectionName = 'users';

    constructor(private firestore: Firestore) { }

    async createUser(user: User): Promise<void> {
        const usersCollection = collection(this.firestore, this.usersCollectionName);
        const userRef = doc(usersCollection); 
        await setDoc(userRef, {
            ...user,
            _id: userRef.id,
        });
    }

    getUserByEmail(email: string): Observable<User[]> {
        const usersCollection = collection(this.firestore, this.usersCollectionName);
        const userQuery = query(usersCollection, where('email', '==', email));
        return collectionData(userQuery, { idField: '_id' }) as Observable<User[]>;
    }

    getUsers(): Observable<User[]> {
        const usersCollection = collection(this.firestore, this.usersCollectionName);
        return collectionData(usersCollection, { idField: '_id' }) as Observable<User[]>;
    }

    async getUserById(userId: string): Promise<User | undefined> {
        const userDocRef = doc(this.firestore, `${this.usersCollectionName}/${userId}`);
        const userSnapshot = await getDoc(userDocRef);
        return userSnapshot.exists() ? (userSnapshot.data() as User) : undefined;
    }

    async updateUser(userId: string, updatedUser: Partial<User>): Promise<void> {
        const userDocRef = doc(this.firestore, `${this.usersCollectionName}/${userId}`);
        await updateDoc(userDocRef, updatedUser);
    }

    async deleteUser(userId: string): Promise<void> {
        const userDocRef = doc(this.firestore, `${this.usersCollectionName}/${userId}`);
        await deleteDoc(userDocRef);
    }
}

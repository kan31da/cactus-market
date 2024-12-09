import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../types/user';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {

    private user$$ = new BehaviorSubject<User | null>(null);
    private user$ = this.user$$.asObservable();
    private userSubscription: Subscription | null = null;
    private user: User | null = null;

    get userData(): User | null {
        return this.user;
    }

    private usersCollectionName = 'users';

    constructor(private firestore: Firestore) {
        this.userSubscription = this.user$.subscribe((user) => {
            this.user = user;
        });
    }

    subscribeUser(email: string) {
        this.unsubscribeUser();
        this.getUserByEmail(email).subscribe((userList) => {
            if (userList && userList.length > 0) {
                this.user$$.next(userList[0]);
                this.user = userList[0];
            }
            else {
                this.user$$.next(null);
                this.user = null;
            }
        });
    }

    unsubscribeUser() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
            this.userSubscription = null;
        }
        this.user = null;
        this.user$$.next(null);
    }

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

    ngOnDestroy(): void {
        this.user = null;
        this.userSubscription?.unsubscribe();
    }
}

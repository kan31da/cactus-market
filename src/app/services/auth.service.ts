import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, user, UserCredential } from '@angular/fire/auth';
import { from, map, Observable, tap } from 'rxjs';
import { User } from '../types/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<User | null | undefined>(undefined);

    register(email: string, username: string, password: string): Observable<UserCredential> {
        return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
            tap(userCredential =>
                updateProfile(userCredential.user, { displayName: username })
            )
        );
    }

    login(email: string, password: string): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.firebaseAuth, email, password));
    }

    updatePassword(password: string): Observable<void> {
        const user = this.firebaseAuth.currentUser;
        return from(updatePassword(user!, password));
    }

    logout(): Observable<void> {
        return from(signOut(this.firebaseAuth));
    }
}
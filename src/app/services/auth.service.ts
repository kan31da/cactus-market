import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserForAuth } from '../types/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    private firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<UserForAuth | null | undefined>(undefined);

    register(email: string, username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(response => updateProfile(response.user, { displayName: username }));

        return from(promise);
    }

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
            .then(() => { });

        return from(promise);
    }

    updatePassword(password: string) {
        const auth = getAuth();
        const user = auth.currentUser;
        const promise = updatePassword(user!, password)
            .then(() => { });

        return from(promise);
    }

    logout(): Observable<void> {
        const promise = signOut(this.firebaseAuth);

        return from(promise);
    }
}
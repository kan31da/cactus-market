import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../types/cart';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../types/user';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartsCollectionName = 'carts';

    private firestore = inject(Firestore);
    private authService = inject(AuthService);
    public currentCart = signal<Cart | null>(null);

    constructor() {
        this.authService.user$.pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.getCartByUid(user.uid).pipe(
                        map((carts) => (carts.length > 0 ? carts[0] : null))
                    );
                } else {
                    return of(null);
                }
            })
        ).subscribe((cart: Cart | null) => this.currentCart.set(cart));
    }

    get cart(): Cart {
        return this.currentCart()!;
    }

    createCart(cart: Cart): Observable<void> {
        const cartsCollection = collection(this.firestore, this.cartsCollectionName);
        const cartRef = doc(cartsCollection);
        return from(setDoc(cartRef, { ...cart, _id: cartRef.id, }));
    }

    private getCartByUid(uid: string): Observable<Cart[]> {
        const cartsCollection = collection(this.firestore, this.cartsCollectionName);
        const cartQuery = query(cartsCollection, where('uid', '==', uid));
        return collectionData(cartQuery, { idField: '_id' }) as Observable<Cart[]>;
    }

    getCarts(): Observable<Cart[]> {
        const cartsCollection = collection(this.firestore, this.cartsCollectionName);
        return collectionData(cartsCollection, { idField: '_id' }) as Observable<Cart[]>;
    }

    getCartById(cartId: string): Observable<Cart | undefined> {
        const cartDocRef = doc(this.firestore, `${this.cartsCollectionName}/${cartId}`);
        return from(getDoc(cartDocRef)).pipe(
            map(cartSnapshot => cartSnapshot.exists() ? (cartSnapshot.data() as Cart) : undefined)
        );
    }

    updateCart(cartId: string, updatedCart: Partial<Cart>): Observable<void> {
        const cartDocRef = doc(this.firestore, `${this.cartsCollectionName}/${cartId}`);
        return from(updateDoc(cartDocRef, updatedCart));
    }

    deleteCart(cartId: string): Observable<void> {
        const cartDocRef = doc(this.firestore, `${this.cartsCollectionName}/${cartId}`);
        return from(deleteDoc(cartDocRef));
    }

    clearCart(): void {
        this.currentCart.set(null);
    }

    get cactusesDataGetQuantity(): number {
        const cart = this.currentCart();
        if (!cart || !cart.cactuses || cart.cactuses.length === 0) {
            return 0;
        }
        return cart.cactuses.reduce((total, cactus) => {
            const quantity = cactus.quantity;
            return total + quantity;
        }, 0);
    }
}

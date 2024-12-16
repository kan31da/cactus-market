import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../types/cart';
import { from, map, Observable, tap } from 'rxjs';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartsCollectionName = 'carts';

    // private cart$$ = new BehaviorSubject<Object | null>(null);
    private firestore = inject(Firestore);
    public cart$ = this.firestore;
    currentCart = signal<Cart | null>({} as Cart);

    // constructor(private firestore: Firestore) { }
    constructor() { }

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

    loadCart(uid: string) {
        this.getCartByUid(uid).pipe(
            tap(cart => {
                this.currentCart.set(cart[0]);
            })
        ).subscribe();
    }
}

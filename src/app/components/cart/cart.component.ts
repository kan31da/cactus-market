import { Component, signal } from '@angular/core';
import { Cactus } from '../../types/cactus';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { User } from '../../types/user';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [RouterLink, NgClass, CurrencyPipe],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent {

    // cactuses = signal<Cactus[]>([]);
    checkOutMessage = signal<string>('');
    isCheckOut = signal<boolean>(false);

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.checkOutMessage.set('');
    }

    get userData(): User | null | undefined {
        return this.authService.currentUserSig();
    }
    get cactusesData(): Cactus[] {
        return this.cartService.cart.cactuses;
    }
    get cactusesDataGetLength(): boolean {
        const cart = this.cartService.cart;
        return cart && cart.cactuses ? cart.cactuses.length > 0 : false;
    }

    // calculatePrice(): number {
    //     const cart = this.cartService.currentCart();
    //     if (!cart || cart.cactuses) {
    //         return 0;
    //     }
    //     // return this.cactuses().reduce((total, cactus) => total + cactus.price, 0);
    //     return this.cartService.currentCart()!.cactuses.reduce((total, cactus) => total + cactus.price, 0);//TODO TODO TODO quantity
    // }
    calculatePrice(): number {
        const cart = this.cartService.currentCart();
        if (!cart || !cart.cactuses || cart.cactuses.length === 0) {
            return 0;
        }
        return cart.cactuses.reduce((total, cactus) => {
            const price = cactus.price || 0;
            const quantity = cactus.quantity || 1;
            return total + price * quantity;
        }, 0);
    }
    getPrice(): number {
        return this.calculatePrice();
    }
    getPriceWithShippingTaxes(): number {
        return (this.calculatePrice() + 5);
    }
    isCactusListEmpty(): boolean {
        const cart = this.cartService.cart;
        return cart && cart.cactuses ? cart.cactuses.length === 0 : true;
    }

    deleteCactus(cactusId: string, cactusName: string) {

        if (this.cartService.cart.cactuses) {

            this.cartService.cart.cactuses = this.cartService.cart.cactuses.filter(x => {
                return x._id != cactusId;
            });

            this.cartService.updateCart(this.cartService.cart?._id!, this.cartService.cart)
                .subscribe({
                    next: () => {
                        this.toastr.warning(`"${cactusName}" has been removed from your cart.`, 'Cactus Removed!');
                    }
                });

        } else {

            this.toastr.warning('Unable to remove cactus: Cart is empty or undefined.');
        }
    }

    proceedCheckout(): void {

        const total = this.getPriceWithShippingTaxes();
        const count = this.cartService.cart.cactuses.length;// TODO TODO quantity price

        this.cartService.cart.cactuses = [];
        this.cartService.updateCart(this.cartService.cart?._id!, this.cartService.cart)
            .subscribe({
                next: () => {
                    this.isCheckOut.set(true);

                    this.checkOutMessage.set(`Successfully ordered ${count} cactus(es) for ${this.userData?.uid}. Total: ${total} 'Your order has been processed.'`);
                    this.toastr.success(`Successfully ordered ${count} cactus(es) for ${this.userData?.uid}. Total: ${total}`, 'Your order has been processed.');
                }
            });

    }
}
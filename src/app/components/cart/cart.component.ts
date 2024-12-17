import { Component, signal } from '@angular/core';
import { Cactus } from '../../types/cactus';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { User } from '../../types/user';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { DEFAULT_FLAT_RATE } from '../../utils/constants';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [RouterLink, NgClass, CurrencyPipe],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent {
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
    get flatRate(): number {
        return DEFAULT_FLAT_RATE;
    }

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
        return (this.calculatePrice() + DEFAULT_FLAT_RATE);
    }
    isCactusListEmpty(): boolean {
        const cart = this.cartService.cart;
        return cart && cart.cactuses ? cart.cactuses.length === 0 : true;
    }
    getPriceForCurrentCactus(cactusId: string): number {
        const existingCactus = this.cartService.cart.cactuses.find(x => x._id === cactusId);
        return existingCactus?.price! * existingCactus?.quantity!
    }

    plusQuantity(cactusId: string): void {
        this.cartService.cart.cactuses.forEach(x => {
            if (x._id === cactusId) {
                x.quantity++;
                this.updateCart();
            }
        });
    }
    minusQuantity(cactusId: string): void {
        this.cartService.cart.cactuses.forEach(x => {
            if (x._id === cactusId) {
                if (x.quantity > 1) {
                    x.quantity--;
                    this.updateCart();
                }
            }
        });
    }

    private updateCart(): void {
        this.cartService.updateCart(this.cartService.cart._id, this.cartService.cart).subscribe({
            next: () => {
                this.toastr.info('Product quantity updated.', 'Cart Updated');
            }
        });
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
        const count = this.cartService.cactusesDataGetQuantity;

        this.cartService.cart.cactuses = [];
        this.cartService.updateCart(this.cartService.cart?._id!, this.cartService.cart)
            .subscribe({
                next: () => {
                    this.isCheckOut.set(true);

                    this.checkOutMessage.set(`Successfully ordered ${count} cactus(es) for ${this.userData?.email}. Total:$ ${total.toFixed(2)} 'Your order has been processed.'`);
                    this.toastr.success(`Successfully ordered ${count} cactus(es) for ${this.userData?.email}. Total:$ ${total.toFixed(2)}`, 'Your order has been processed.');
                }
            });

    }
}
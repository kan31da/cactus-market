import { Component } from '@angular/core';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent {

    cactuses: Cactus[] = [];
    userId: string | null = null;
    couponCode: string | null = null;
    checkOutMessage: string | null = null;
    isCheckOut = false;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.userId = this.authService.currentUserSig()?.email || null;
        this.cactuses = this.userService.userData?.cart.cactuses!;
    }

    calculatePrice(): number {
        if (!this.cactuses || this.cactuses.length === 0) {
            return 0;
        }
        return this.cactuses.reduce((total, cactus) => total + cactus.price, 0);
    }
    getPrice(): string {
        return this.calculatePrice().toFixed(2);
    }
    getPriceWithShippingTaxes(): string {
        return (this.calculatePrice() + 5).toFixed(2);
    }
    isCactusListEmpty(): boolean {
        return this.cactuses.length === 0;
    }

    deleteCactus(cartCactusId: string, cactusName: string) {

        if (this.cactuses) {

            const user: User = { ...this.userService.userData! };

            user.cart.cactuses = user.cart.cactuses.filter(x => {
                return x.cartCactusId != cartCactusId;
            });

            this.userService.updateUser(user._id, user).then(() => {
                this.userService.updateUserState(user);

                this.cactuses! = this.cactuses.filter(x => {
                    return x.cartCactusId != cartCactusId;
                })

                this.toastr.warning(`"${cactusName}" has been removed from your cart.`, 'Cactus Removed!');

            }).catch(error => {

                this.toastr.error('Error removing cactus: ' + error.message);
            });
        } else {

            this.toastr.warning('Unable to remove cactus: Cart is empty or undefined.');
        }
    }

    proceedCheckout(): void {

        const user: User = { ...this.userService.userData! };
        const total = this.getPriceWithShippingTaxes();
        const count = this.cactuses.length;

        user.cart.cactuses = [];

        this.userService.updateUser(user._id, user).then(() => {
            this.userService.updateUserState(user);

            this.cactuses! = [];
            this.isCheckOut = true;
            this.checkOutMessage = `Successfully ordered ${count} cactus(es) for ${this.userId}. Total: ${total}`, 'Your order has been processed.';
            this.toastr.success(`Successfully ordered ${count} cactus(es) for ${this.userId}. Total: ${total}`, 'Your order has been processed.');

        }).catch(error => {

            this.toastr.error('Checkout Error: ' + error.message);
        });
    }
}

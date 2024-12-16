import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { CACTUSES_PER_PAGE } from '../../utils/constants';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../types/user';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [RouterLink, NgFor, NgClass, CurrencyPipe],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
    private cactuses = signal<Cactus[]>([]);
    paginatedCactuses = signal<Cactus[]>([]);
    currentPage = signal(1);

    constructor(
        private cactusService: CactusService,
        private authService: AuthService,
        private cartService: CartService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.cactusService.getCactuses().subscribe((cactuses) => {
            if (cactuses) {
                this.cactuses.set(cactuses);
                this.updatePaginatedItems();
            }
        })
    }

    get userData(): User | null | undefined {
        return this.authService.currentUserSig();
    }

    addToCart(cactusId: string) {

        if (this.userData?.uid == null) {
            this.toastr.info('To proceed with your purchase of an item, please log in to your account.', 'Login Required',);
            return;
        }

        const cactus = this.cactuses().find(c => c._id === cactusId);

        if (cactus && this.userData.uid !== cactus.userId) {
            this.cartService.cart.cactuses.push(cactus);
            this.cartService.updateCart(this.cartService.currentCart()?._id!, this.cartService.cart)
                .subscribe({
                    next: () => {
                        this.toastr.success(`Great news! ${cactus.cactusName} has been added to your cart for ${cactus.price.toFixed(2)} $.`, 'Added to Cart');
                    },
                    error: (err) => {
                        this.toastr.error('Error updating user:', err);  //TODO TODO TODO
                    }
                });
        }
    }

    isOwner(cactus: Cactus): boolean {
        return this.userData != null && this.userData.uid === cactus.userId;
    }

    updatePaginatedItems() {
        const startIndex = (this.currentPage() - 1) * CACTUSES_PER_PAGE;
        this.paginatedCactuses.set(this.cactuses().slice(startIndex, startIndex + CACTUSES_PER_PAGE));
    }

    goToPage(page: number): void {
        this.currentPage.set(page);
        this.updatePaginatedItems();
    }

    get totalPages(): number {
        return Math.ceil(this.cactuses().length / CACTUSES_PER_PAGE);
    }
}
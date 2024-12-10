import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { NgClass, NgFor } from '@angular/common';
import { CACTUSES_PER_PAGE } from '../../utils/constants';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [RouterLink, NgFor, NgClass],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css'
})
export class ShopComponent {
    cactuses: Cactus[] = [];
    paginatedCactuses: Cactus[] = [];
    userId: string | null = null;
    cactusesPerPage: number = CACTUSES_PER_PAGE;
    currentPage: number = 1;

    constructor(
        private cactusService: CactusService,
        private authService: AuthService,
        private userService: UserService,       
        private toastr: ToastrService) { }

    async ngOnInit(): Promise<void> {

        this.userId = this.authService.currentUserSig()?.email || null;

        this.cactusService.getCactuses().subscribe((cactuses) => {
            if (cactuses) {
                this.cactuses = cactuses;
                this.updatePaginatedItems();
            }
        })
    }

    addToCart(cactusId: string) {

        if (this.userId == null) {
            this.toastr.info('To proceed with your purchase of an item, please log in to your account.', 'Login Required',);
            return;
        }

        const cactus = this.cactuses.find(c => c._id === cactusId);

        if (cactus && this.userService.userData?._id !== cactus.userId) {
            this.userService.userData?.cart.cactuses.push(cactus);
            this.toastr.success(`Great news! ${cactus.cactusName} has been added to your cart for ${cactus.price} $.`, 'Added to Cart');
        }
    }

    isOwner(cactus: Cactus): boolean {
        return this.userId != null && this.userId === cactus.userId;
    }



    updatePaginatedItems() {
        const startIndex = (this.currentPage - 1) * this.cactusesPerPage;
        this.paginatedCactuses = this.cactuses.slice(startIndex, startIndex + this.cactusesPerPage);
    }

    goToPage(page: number): void {
        this.currentPage = page;
        this.updatePaginatedItems();
    }

    get totalPages(): number {
        return Math.ceil(this.cactuses.length / this.cactusesPerPage);
    }
}
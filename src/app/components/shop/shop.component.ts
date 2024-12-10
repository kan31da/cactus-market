import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { NgClass, NgFor } from '@angular/common';
import { CACTUSES_PER_PAGE } from '../../utils/constants';
import { UserService } from '../../services/user.service';

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

    constructor(private cactusService: CactusService, private authService: AuthService, private userService: UserService, private router: Router) { }

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
            this.router.navigateByUrl('/login');
        }

        const cactus = this.cactuses.find(c => c._id === cactusId);

        if (cactus && this.userService.userData?._id !== cactus.userId) {
            this.userService.userData?.cart.cactuses.push(cactus);
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
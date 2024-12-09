import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { NgFor } from '@angular/common';
import { CACTUSES_PER_PAGE } from '../../utils/constants';

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [RouterLink, NgFor],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css'
})
export class ShopComponent {
    cactuses: Cactus[] = [];
    paginatedCactuses: Cactus[] = [];
    userID: string | null = null;
    cactusesPerPage: number = CACTUSES_PER_PAGE; 
    currentPage: number = 1;    

    constructor(private cactusService: CactusService, private authService: AuthService) { }

    async ngOnInit(): Promise<void> {

        this.userID = this.authService.currentUserSig()?.email || null;

        this.cactusService.getCactuses().subscribe((cactuses) => {
            if (cactuses) {
                this.cactuses = cactuses;
                this.updatePaginatedItems();
            }
        })
    }

    //Add to cart


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
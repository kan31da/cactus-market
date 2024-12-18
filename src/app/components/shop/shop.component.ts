import { Component, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { CACTUSES_PER_PAGE } from '../../utils/constants';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../types/user';
import { CartService } from '../../services/cart.service';
import { SlicePipe } from '../../shared/pipes/slice.pipe';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [RouterLink, NgFor, NgClass, CurrencyPipe, SlicePipe, FormsModule],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit, OnChanges {
    private cactuses = signal<Cactus[]>([]);
    paginatedCactuses = signal<Cactus[]>([]);
    currentPage = signal(1);

    searchTerm: string = '';
    filteredItems = signal<Cactus[]>([]);
    selectedSortCriteria: string = 'nothing';

    constructor(
        private cactusService: CactusService,
        private authService: AuthService,
        private cartService: CartService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.cactusService.getCactuses().subscribe((cactuses) => {
            if (cactuses) {
                this.cactuses.set(cactuses);
                this.filteredItems.set(cactuses);
                this.updatePaginatedItems(cactuses);
            }
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['searchTerm'] || changes['selectedSortCriteria']) {
            this.updateFilteredItems();
        }
    }

    onSearch(): void {
        this.currentPage.set(1);
        this.updateFilteredItems();
    }

    onSortChange(): void {
        const criterion = this.selectedSortCriteria;
        let sortedItems = [...this.filteredItems()];

        if (criterion === 'price-asc') {
            sortedItems.sort((a, b) => a.price - b.price);
        }
        else if (criterion === 'price-desc') {
            sortedItems.sort((a, b) => b.price - a.price);
        }
        else if (criterion === 'name') {
            sortedItems.sort((a, b) => a.cactusName.localeCompare(b.cactusName));
        }
        else if (criterion === 'nothing') {
            sortedItems = [...this.cactuses()];
        }

        this.filteredItems.set(sortedItems);
        this.updatePaginatedItems(sortedItems);
    }

    filterByPriceRange(range: string): void {
        let filtered = [...this.cactuses()];
        switch (range) {
            case 'under5':
                filtered = filtered.filter(cactus => cactus.price < 5);
                break;
            case '5to10':
                filtered = filtered.filter(cactus => cactus.price >= 5 && cactus.price < 10);
                break;
            case '10to20':
                filtered = filtered.filter(cactus => cactus.price >= 10 && cactus.price < 20);
                break;
            case '20to50':
                filtered = filtered.filter(cactus => cactus.price >= 20 && cactus.price < 50);
                break;
            case '50to100':
                filtered = filtered.filter(cactus => cactus.price >= 50 && cactus.price < 100);
                break;
            case 'above100':
                filtered = filtered.filter(cactus => cactus.price >= 100);
                break;
            default:
                filtered = [...this.cactuses()];
                break;
        }
        this.filteredItems.set(filtered);
        this.updatePaginatedItems(filtered);
    }

    private updateFilteredItems(): void {
        const filtered = this.cactuses().filter(cactus =>
            cactus.cactusName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.filteredItems.set(filtered);
        this.updatePaginatedItems(filtered);
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

            const existingCactus = this.cartService.cart.cactuses.find(x => x._id === cactus._id);

            if (existingCactus) {
                existingCactus.quantity += cactus.quantity!;
            } else {
                this.cartService.cart.cactuses.push(cactus);
            }

            this.cartService.updateCart(this.cartService.currentCart()?._id!, this.cartService.cart)
                .subscribe({
                    next: () => {
                        this.toastr.success(`Great news! ${cactus.cactusName} has been added to your cart for ${cactus.price.toFixed(2)} $.`, 'Added to Cart');
                    },
                    error: (err) => {
                        this.toastr.error('Error updating user:', err);
                    }
                });
        }
    }

    isOwner(cactus: Cactus): boolean {
        return this.userData != null && this.userData.uid === cactus.userId;
    }

    private updatePaginatedItems(filteredItems: Cactus[] = []): void {
        const startIndex = (this.currentPage() - 1) * CACTUSES_PER_PAGE;
        if (filteredItems) {
            this.paginatedCactuses.set(filteredItems.slice(startIndex, startIndex + CACTUSES_PER_PAGE));
        } else {
            this.paginatedCactuses.set(this.cactuses().slice(startIndex, startIndex + CACTUSES_PER_PAGE));
        }
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage.set(page);
        this.updatePaginatedItems(this.filteredItems());
    }

    get totalPages(): number {
        return Math.ceil(this.filteredItems().length / CACTUSES_PER_PAGE);
    }
}
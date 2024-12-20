import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    private activeLink: string = '/home';

    constructor(
        private router: Router,
        private authService: AuthService,
        private cartService: CartService,
        private toastr: ToastrService
    ) {
        this.router.events.subscribe(() => {
            this.activeLink = this.router.url; // Update the active link
        });
    }

    get userData(): User | null {
        return this.authService.currentUserSig() as User;
    }
    get cactusesGetQuantity(): number {
        return this.cartService.cactusesDataGetQuantity;
    }

    isActive(link: string): boolean {
        return this.activeLink === link;
    }

    isAuth(): boolean {
        return this.authService.currentUserSig() == null;
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.toastr.info(`You have been logged out successfully.`, 'Logout Successful!');
                this.router.navigateByUrl('/');
            }
        });
    }
}
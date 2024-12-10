import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../types/user';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    private activeLink: string = '/home';

    constructor(private router: Router, private authService: AuthService, private userService: UserService) {
        this.router.events.subscribe(() => {
            this.activeLink = this.router.url; // Update the active link
        });
    }

    get user(): User | null {
        return this.userService.userData;       
        // return this.authService.currentUserSig() as User
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
                this.userService.unsubscribeUser();
                this.router.navigateByUrl('/');
            }
        });
    }
}
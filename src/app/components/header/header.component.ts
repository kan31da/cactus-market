import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    private activeLink: string = '/home';

    constructor(private router: Router, private authService: AuthService) {
        this.router.events.subscribe(() => {
            this.activeLink = this.router.url; // Update the active link
        });
    }

    isActive(link: string): boolean {
        return this.activeLink === link;
    }

    isAuth(): boolean {
        return this.authService.currentUserSig() == null;
    }
    
    logout(){
        this.authService.logout();
    }
}

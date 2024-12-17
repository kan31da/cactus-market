import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports:
        [
            RouterOutlet,
            HeaderComponent,
            FooterComponent,
        ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    title = 'cactus-market';

    constructor(private authService: AuthService, private cartService: CartService) { }

    ngOnInit(): void {
        this.authService.user$.subscribe((auth: any) => {
            if (auth) {

                if (auth.displayName == null) {
                    auth.reload();
                }

                this.authService.currentUserSig
                    .set({
                        email: auth.email,
                        uid: auth.uid,
                        displayName: auth.displayName,
                    });              
            }
            else {
                this.authService.currentUserSig.set(null);
                this.cartService.clearCart();
            }
        });
    }
}
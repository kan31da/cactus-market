import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

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

    constructor(private authService: AuthService) { }//TODO TODO TODO
    // authService = inject(AuthService);

    ngOnInit(): void {
        this.authService.user$.subscribe((auth: any) => {
            if (auth) {
                this.authService.currentUserSig
                    .set({
                        email: auth.email!,
                    });
            }
            else {
                this.authService.currentUserSig.set(null);
            }

            console.log(this.authService.currentUserSig());//TODO TODO TODO
        });
    }
}

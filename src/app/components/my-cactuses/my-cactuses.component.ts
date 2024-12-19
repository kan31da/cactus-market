import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-my-cactuses',
    standalone: true,
    imports: [RouterLink, CurrencyPipe, AsyncPipe],
    templateUrl: './my-cactuses.component.html',
    styleUrl: './my-cactuses.component.css'
})
export class MyCactusesComponent {
    cactuses$: Observable<Cactus[]> = of([]);

    constructor(
        private cactusService: CactusService,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router) { }

    ngOnInit(): void {
        this.cactuses$ = this.cactusService.getCactusByUserID(this.authService.currentUserSig()?.uid!);
    }

    deleteCactus(cactusId: string, cactusName: string) {
        this.cactusService.deleteCactus(cactusId).subscribe({
            next: () => {
                this.toastr.warning(`"${cactusName}" has been removed from your collection.`, 'Cactus Removed!');
            }
        });
    }

    editCactus(cactusId: string) {
        this.router.navigate([`add-cactus/${cactusId}`]);
    }
}
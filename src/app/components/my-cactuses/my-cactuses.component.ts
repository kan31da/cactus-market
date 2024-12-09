import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-my-cactuses',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './my-cactuses.component.html',
    styleUrl: './my-cactuses.component.css'
})
export class MyCactusesComponent {

    cactuses: Cactus[] = [];

    userId: string | null = null;

    constructor(private cactusService: CactusService, private authService: AuthService, private toastr: ToastrService) { }

    ngOnInit(): void {

        this.userId = this.authService.currentUserSig()?.email || null;

        this.cactusService.getCactusByUserID(this.userId!).subscribe((cactuses) => {
            if (cactuses) {
                this.cactuses = cactuses;
            }
        })
    }

    deleteCactus(cactusId: string, cactusName: string) {
        this.cactusService.deleteCactus(cactusId).then(() => {
            this.cactuses = this.cactuses.filter(x => {
                return x._id != cactusId;
            })
            this.toastr.warning(`"${cactusName}" has been removed from your collection.`, 'Cactus Removed!');
        });
    }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './details.component.html',
    styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
    cactus = {} as Cactus;
    cactusId: string | null = null;
    userID: string | null = null;

    constructor(private route: ActivatedRoute, private cactusService: CactusService, private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.cactusId = this.route.snapshot.params["cactusId"];
        this.userID = this.authService.currentUserSig()?.email || null;

        this.cactusService.getCactusById(this.cactusId!).then((cactus) => {
            if (cactus) {
                this.cactus = cactus;
            }
            else {
                this.cactusId = null;
                this.router.navigate(['/404']);
            }
        })
    }
}
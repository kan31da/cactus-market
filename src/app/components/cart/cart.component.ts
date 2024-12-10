import { Component } from '@angular/core';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Cart } from '../../types/cart';
import { User } from '../../types/user';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent {

    cactuses: Cactus[] = [];
    userId: string | null = null;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.userId = this.authService.currentUserSig()?.email || null;
        this.cactuses = this.userService.userData?.cart.cactuses!;
    }

    deleteCactus(cartCactusId: string, cactusName: string) {

        if (this.cactuses) {

            const user: User = { ...this.userService.userData! };

            user.cart.cactuses = user.cart.cactuses.filter(x => {
                return x.cartCactusId != cartCactusId;
            });

            this.userService.updateUser(user._id, user).then(() => {
                this.userService.updateUserState(user);

                this.cactuses! = this.cactuses.filter(x => {
                    return x.cartCactusId != cartCactusId;
                })

                this.toastr.warning(`"${cactusName}" has been removed from your cart.`, 'Cactus Removed!');

            }).catch(error => {

                this.toastr.error('Error removing cactus: ' + error.message);
            });
        } else {

            this.toastr.warning('Unable to remove cactus: Cart is empty or undefined.');
        }
    }
}

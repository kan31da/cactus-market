import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { NgClass, NgIf } from '@angular/common';
import { User } from '../../types/user';
import { generateRandomId } from '../../utils/generate-id';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../types/review';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [RouterLink, NgClass, ReactiveFormsModule, NgIf],
    templateUrl: './details.component.html',
    styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

    reviewForm: FormGroup;
    cactus = {} as Cactus;
    cactusId: string | null = null;
    userId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private cactusService: CactusService,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private toastr: ToastrService,
        private fb: FormBuilder,) {

        this.reviewForm = this.fb.nonNullable.group({
            name: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
            review: ['', [Validators.required, Validators.maxLength(300)]],
        });
    }

    ngOnInit(): void {
        this.cactusId = this.route.snapshot.params["cactusId"];
        this.userId = this.authService.currentUserSig()?.email || null;

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

    addToCart(cactusId: string) {

        if (this.userId == null) {
            this.toastr.info('To proceed with your purchase of an item, please log in to your account.', 'Login Required',);
            return;
        }

        if (this.cactus && this.userService.userData?._id !== this.cactus.userId) {

            const user: User = { ...this.userService.userData! };
            user.cart.cactuses.push({ ...this.cactus, cartCactusId: generateRandomId() });
            this.userService.updateUser(user._id, user).then(() => {
                this.userService.updateUserState(user);
                this.toastr.success(`Great news! ${this.cactus.cactusName} has been added to your cart for ${this.cactus.price} $.`, 'Added to Cart');

            }).catch(error => {

                this.toastr.error('Error add cactus: ' + error.message);
            })
        }
    }

    isCactus(): boolean {
        return this.cactus !== null;
    }

    isOwner(): boolean {
        return this.userId != null && this.userId === this.cactus.userId;
    }

    canAddPost(): boolean {
        return this.userId != null && this.userId !== this.cactus.userId;
    }

    submitReview() {

        if (this.reviewForm.valid) {
            const formData: Review = {
                ...this.reviewForm.value,
                _id: generateRandomId(),
                date: this.formatDateToReadableString()
            };
            this.cactus.reviews.push(formData);
            this.cactusService.updateCactus(this.cactusId!, this.cactus)
                .then(() => {
                    this.reviewForm.reset();
                    this.toastr.info('Thank you for your review! Your feedback has been posted successfully.', 'Review Submitted');
                });
        } else {
            this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error Submitting Review');
        }
    }

    formatDateToReadableString(): string {
        const date = new Date(Date.now());
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }
}

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { User } from '../../types/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../types/review';
import { map, Observable, of } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [RouterLink, NgClass, ReactiveFormsModule, NgIf, CurrencyPipe, AsyncPipe, DatePipe],
    templateUrl: './details.component.html',
    styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
    cactus = signal<Cactus | null | undefined>(null);

    reviews$: Observable<Review[]> = of([]);
    reviewForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private cactusService: CactusService,
        private router: Router,
        private authService: AuthService,
        private reviewService: ReviewService,
        private cartService: CartService,
        private toastr: ToastrService,
        private fb: FormBuilder,) {

        this.reviewForm = this.fb.nonNullable.group({
            review: ['', [Validators.required, Validators.maxLength(300)]],
        });
    }

    get userData(): User | null | undefined {
        return this.authService.currentUserSig();
    }

    ngOnChanges() {
        //TODO TODO TODO
    }

    ngOnInit(): void {
        this.cactusService.getCactusById(this.route.snapshot.params["cactusId"]).subscribe({
            next: (cactus) => {
                if (cactus) {
                    this.cactus.set(cactus);
                    this.reviews$ = this.reviewService.getReviewsByCactusId(cactus._id);
                }
                else {
                    this.cactus.set({} as Cactus);
                    this.router.navigate(['/404']);
                }
            }
        })
    }

    addToCart() {

        if (this.userData == null) {
            this.toastr.info('To proceed with your purchase of an item, please log in to your account.', 'Login Required',);
            return;
        }

        if (this.cactus && this.userData.uid !== this.cactus()?.userId) {

            const newCactus = { ...this.cactus()! }; 

            const existingCactus = this.cartService.cart.cactuses.find(x => x._id === newCactus._id);
        
            if (existingCactus) {                
                existingCactus.quantity += newCactus.quantity!;
            } else {                
                this.cartService.cart.cactuses.push(newCactus);
            }

            this.cartService.updateCart(this.cartService.cart._id, this.cartService.cart).subscribe({
                next: () => {
                    this.toastr.success(`Great news! ${this.cactus()?.cactusName} has been added to your cart for ${this.cactus()?.price} $.`, 'Added to Cart')
                }
            });
        }
    }

    isCactus(): boolean {
        return this.cactus !== null;
    }

    isOwner(): boolean {
        return this.userData != null && this.userData.uid === this.cactus()?.userId;
    }

    canAddPost(): boolean {
        return this.userData != null && this.userData.uid !== this.cactus()?.userId;
    }

    submitReview() {

        if (this.reviewForm.valid) {
            const formData: Review =
            {
                ...this.reviewForm.value,
                uid: this.userData?.uid,
                name: this.userData?.displayName,
                email: this.userData?.email,
                date: Date.now(),
                cactusId: this.cactus()?._id
            };

            this.reviewService.addReview(formData).subscribe({
                next: () => {
                    this.reviewForm.reset();
                    this.toastr.info('Thank you for your review! Your feedback has been posted successfully.', 'Review Submitted');
                }
            });
        } else {
            this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error Submitting Review');
        }
    }
    removeReview(reviewId: string) {
        this.reviewService.deleteReview(reviewId).subscribe({
            next: () => {
                this.toastr.warning('Your review has been removed successfully.', 'Review Deleted');
            }
        });
    }

    plusQuantity(): void {
        this.cactus.update(value => ({ ...value!, quantity: (value?.quantity ?? 0) + 1 }));
    }
    minusQuantity(): void {
        if (this.cactus()?.quantity! > 1) {
            this.cactus.update(value => ({ ...value!, quantity: (value?.quantity ?? 1) - 1 }));
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

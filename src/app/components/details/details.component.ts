import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cactus } from '../../types/cactus';
import { CactusService } from '../../services/cactus.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { User } from '../../types/user';
import { generateRandomId } from '../../utils/generate-id';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../types/review';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [RouterLink, NgClass, ReactiveFormsModule, NgIf, CurrencyPipe],
    templateUrl: './details.component.html',
    styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
    cactus = signal<Cactus>({
        _id: '',
        cactusName: '',
        description: '',
        price: 0,
        userId: '',
        image: '',
        reviews: [],
        shortDescription: '',
        quantity: 0
    });

    reviewForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private cactusService: CactusService,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService,
        private fb: FormBuilder,) {

        this.reviewForm = this.fb.nonNullable.group({
            // name: ['', [Validators.required, Validators.maxLength(50)]],
            // email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
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
                }
                else {
                    this.cactus.set({} as Cactus);
                    this.router.navigate(['/404']);
                }
            }
        })
    }

    addToCart(cactusId: string) {

        if (this.userData == null) {
            this.toastr.info('To proceed with your purchase of an item, please log in to your account.', 'Login Required',);
            return;
        }

        if (this.cactus && this.userData.uid !== this.cactus().userId) {

            // const user: User = { ...this.userService.userData! };
            // user.cart.cactuses.push({ ...this.cactus(), cartCactusId: generateRandomId() });
            // this.userService.updateUser(user._id, user).subscribe(u => {
            //     //TODO TODO TODO
            //     console.log(u);
            //     this.userService.updateUserState(user);
            //     this.toastr.success(`Great news! ${this.cactus().cactusName} has been added to your cart for ${this.cactus().price} $.`, 'Added to Cart');
            // });
        }
    }

    isCactus(): boolean {
        return this.cactus !== null;
    }

    isOwner(): boolean {
        return this.userData != null && this.userData.uid === this.cactus().userId;
    }

    canAddPost(): boolean {
        return this.userData != null && this.userData.uid !== this.cactus().userId;
    }

    submitReview() {

        if (this.reviewForm.valid) {//TODO TODO TODO
            const formData: Review = {//TODO TODO TODO //TODO TODO TODO
                ...this.reviewForm.value,
                _id: generateRandomId(),
                date: this.formatDateToReadableString()
            };
            this.cactus().reviews.push(formData);

            this.cactusService.updateCactus(this.cactus()._id, this.cactus())
                .subscribe({
                    next: () => {
                        this.reviewForm.reset();//TODO TODO TODO
                        this.toastr.info('Thank you for your review! Your feedback has been posted successfully.', 'Review Submitted');
                    }
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

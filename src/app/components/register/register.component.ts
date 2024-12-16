import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { matchPasswordsValidator } from '../../utils/match-passwords.validator';
import { NgIf } from '@angular/common';
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from '../../utils/constants';
import { Cart } from '../../types/cart';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, NgIf],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

    public passwordMinLength = PASSWORD_MIN_LENGTH;
    public userNamedMinLength = USERNAME_MIN_LENGTH;
    public form: FormGroup;
    public errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private cartService: CartService,
        private router: Router,
        private toastr: ToastrService) {

        this.form = this.fb.nonNullable.group({
            username: ['', [Validators.required, Validators.minLength(USERNAME_MIN_LENGTH)]],
            email: ['', [Validators.required, Validators.email]],
            passGroup: this.fb.group({
                password: ['', [
                    Validators.required,
                    Validators.minLength(PASSWORD_MIN_LENGTH)
                ]],
                rePassword: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
            },
                { validators: matchPasswordsValidator('password', 'rePassword') }
            )
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }
        else {

            const rawForm = this.form.getRawValue();
            this.authService.register(rawForm.email, rawForm.username, rawForm.passGroup.password)
                .subscribe({
                    next: (data) => {
                        const cart: Cart = { cactuses: [], uid: data.user.uid, _id: '' };
                        this.cartService.createCart(cart).subscribe({
                            next: () => {
                                this.toastr.success(`Welcome, "${rawForm.username}"! Your registration was successful.`, 'Registration Successful!');
                                this.router.navigateByUrl('/');
                            }
                        });
                    },
                    error: (err) => {
                        this.errorMessage = err.code;
                    }
                });
        }
    }
}
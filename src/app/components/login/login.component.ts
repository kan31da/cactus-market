import { Component, inject, } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, NgIf],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService) { }

    fb = inject(FormBuilder);
    public form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    errorMessage: string | null = null;

    onSubmit(): void {

        if (this.form.invalid) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }
        else {
            const rawForm = this.form.getRawValue();
            this.authService.login(rawForm.email, rawForm.password)
                .subscribe({
                    next: () => {
                        this.toastr.info(`You have successfully logged in as "${rawForm.email}".`, 'Login Successful!');
                        this.router.navigateByUrl('/');
                    },
                    error: (err) => {
                        this.errorMessage = this.mapErrorCodeToMessage(err.code);
                    }
                });
        }
    }

    private mapErrorCodeToMessage(code: string): string {
        const errorMessages: { [key: string]: string } = {
            'auth/invalid-email': 'Invalid email format.',
            'auth/user-not-found': 'User not found.',
            'auth/wrong-password': 'Incorrect password.',
        };
        return errorMessages[code] || 'An unexpected error occurred. Please try again.';
    }
}
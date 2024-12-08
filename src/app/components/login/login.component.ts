import { Component, inject, } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, NgIf],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    constructor(private authService: AuthService, private router: Router) { }

    fb = inject(FormBuilder);
    // authService = inject(AuthService);    
    // router = inject(Router);

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
                        this.router.navigateByUrl('/');
                    },
                    error: (err) => {
                        this.errorMessage = err.code;
                    }
                });
        }
    }
}
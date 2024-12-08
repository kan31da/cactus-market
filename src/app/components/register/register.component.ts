import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

    fb = inject(FormBuilder);
    // http = inject(HttpClient);
    router = inject(Router);

    form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
    });

    errorMessage: string | null = null;
    onSubmit(): void {
        if(this.form.invalid){
            this.errorMessage = 'TTTT';
        }
        console.log('register');
    }
}

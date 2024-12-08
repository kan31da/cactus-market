import { Component, inject, } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {


    fb = inject(FormBuilder);
    // http = inject(HttpClient);
    router = inject(Router);

    form = this.fb.nonNullable.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    errorMessage: string | null = null;

    onSubmit(): void {

        if (this.form.invalid) {
            this.errorMessage = 'asdadas'
        }

        console.log(this.form);
    }


}

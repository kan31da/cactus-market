import { Component, OnInit } from '@angular/core';
import { matchPasswordsValidator } from '../../utils/match-passwords.validator';
import { PASSWORD_MIN_LENGTH } from '../../utils/constants';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

    public passwordMinLength = PASSWORD_MIN_LENGTH;
    public form: FormGroup;
    public errorMessage: string | null = null;
    public successMessage: string | null = null;
    public changePassword = false;

    constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService) {

        this.form = this.fb.nonNullable.group({
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

    username: string | undefined;

    get email(): string {
        return this.authService.currentUserSig()?.email || '';
    }

    ngOnInit(): void {
        this.userService.getUserByEmail(this.email).subscribe((userList) => {
            if (userList && userList.length > 0) {
                this.username = userList[0].username;
            }
        });
    }

    onSubmit(): void {

        if (this.form.invalid) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }
        else {
            const rawForm = this.form.getRawValue();
            this.authService.updatePassword(rawForm.passGroup.password)
                .subscribe({
                    next: () => {
                        this.successMessage = 'Password change successful.'
                        this.changePassword = true;
                    },
                    error: (err) => {
                        this.errorMessage = err.code;
                    }
                });
        }
    }
}

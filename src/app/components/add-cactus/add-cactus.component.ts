import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cactus } from '../../types/cactus';
import { NgIf } from '@angular/common';
import { CactusService } from '../../services/cactus.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../types/user';

@Component({
    selector: 'app-add-cactus',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: './add-cactus.component.html',
    styleUrl: './add-cactus.component.css'
})
export class AddCactusComponent implements OnInit {
    cactusForm: FormGroup;
    isEditMode = signal<boolean>(false);
    cactus = signal<Cactus | undefined>(undefined);

    constructor(
        private fb: FormBuilder,
        private cactusService: CactusService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private toastr: ToastrService) {

        this.cactusForm = this.fb.group({
            cactusName: ['', [Validators.required, Validators.maxLength(50)]],
            shortDescription: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.maxLength(300)]],
            image: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0.01)]]
        });
    }

    ngOnInit(): void {
        const cactusId = this.route.snapshot.params['cactusId'];
        this.cactusService.getCactusById(cactusId).subscribe((cactus) => {

            if (cactus && this.userData?.uid == cactus?.userId) {
                this.cactus.set(cactus);
                this.isEditMode.set(true);
            } else {
                this.cactus.set(undefined);
            }

            if (this.isEditMode()) {

                this.cactusForm.patchValue({
                    // cactusName: this.cactus()?.cactusName,
                    // shortDescription: this.cactus()?.shortDescription,
                    // description: this.cactus()?.description,
                    // image: this.cactus()?.image,
                    // price: this.cactus()?.price,
                    // userId: this.cactus()?.userId,
                    ...this.cactus(),
                });
            }
        });
    }

    get userData(): User | null {
        return this.authService.currentUserSig() as User;
    }

    onSubmit(): void {
        if (this.cactusForm.valid) {
            const formData: Cactus = { ...this.cactusForm.value };

            if (this.isEditMode()) {
                this.cactusService.updateCactus(this.cactus()?._id!, formData).subscribe({
                    next: () => {
                        this.toastr.info(`The price of "${formData.cactusName}" has been updated to $${formData.price}.`, 'Cactus Updated!');
                        this.router.navigate([`details/${this.cactus()?._id}`]);
                    }
                });
            }
            else {
                formData.userId = this.userData?.uid!;
                this.cactusService.createCactus(formData).subscribe({
                    next: (cactus) => {
                        debugger;
                        this.toastr.success(`"${formData.cactusName}" has been successfully added at a price of $${formData.price}.`, 'Cactus Added!');
                        this.router.navigate([`details/${cactus}`]);
                    }
                });
            }
        }
    }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cactus } from '../../types/cactus';
import { NgIf } from '@angular/common';
import { CactusService } from '../../services/cactus.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-cactus',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: './add-cactus.component.html',
    styleUrl: './add-cactus.component.css'
})
export class AddCactusComponent implements OnInit {

    cactusForm: FormGroup;
    isEditMode: boolean = false;
    cactus: Cactus | null = null;
    cactusId: string | null = null;
    userId: string | null = null;

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

    async ngOnInit(): Promise<void> {
        this.cactusId = this.route.snapshot.params["cactusId"];

        this.userId = this.authService.currentUserSig()?.email || null;

        const cactus = await this.cactusService.getCactusById(this.cactusId!);
        if (cactus && this.userId == cactus.userId) {
            this.cactus = cactus;
            this.isEditMode = true;
        }

        if (this.isEditMode && this.cactus) {

            this.cactusForm.patchValue({
                cactusName: this.cactus.cactusName,
                shortDescription: this.cactus.shortDescription,
                description: this.cactus.description,
                image: this.cactus.image,
                price: this.cactus.price,
                userId: this.cactus.userId,
            });
        }
    }

    onSubmit(): void {
        if (this.cactusForm.valid) {
            const formData: Cactus = {
                ...this.cactusForm.value,
                reviews: []    , 
                cartCactusId: '',               
            };

            if (this.isEditMode) {

                this.cactusService.updateCactus(this.cactusId!, formData)
                    .then(() => {
                        this.toastr.info(`The price of "${formData.cactusName}" has been updated to $${formData.price}.`, 'Cactus Updated!');
                        this.router.navigate([`details/${this.cactusId}`]);
                    });
            }
            else {

                formData.userId = this.userId!;
                this.cactusService.createCactus(formData)
                    .then(cactusId => {
                        this.toastr.success(`"${formData.cactusName}" has been successfully added at a price of $${formData.price}.`, 'Cactus Added!');
                        this.router.navigate([`details/${cactusId}`]);
                    });
            }
        }
    }
}
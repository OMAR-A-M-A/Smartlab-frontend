import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from '../../../shared/interfaces/patient.interface';
import { Patient as PatientService } from '../../../core/services/patient/patient';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-profile-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  private authService = inject(Auth);
  private patientService = inject(PatientService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  patient: Patient | null = null;
  isEditing: boolean = false;
  isLoading: boolean = true;

  editForm: Patient = {
    name: '',
    email: '',
    phone: '',
    age: 0,
    weight: 0,
    height: 0,
  };

  get profileImage(): string {
    const gender = this.authService.getUserGender();
    return gender === 'female' ? '/images/female-avatar.png' : '/images/male-avatar.png';
  }

  ngOnInit(): void {
    this.loadPatient();
  }

  loadPatient(): void {
    this.isLoading = true;
    this.patientService.getPatientProfile().subscribe({
      next: (res) => {
        const patientData = res.data.patient;
        this.patient = {
          name: patientData.accountId.name,
          email: patientData.accountId.email,
          phone: patientData.accountId.phone,
          age: patientData.age,
          weight: patientData.weight,
          height: patientData.height,
        };
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log(patientData);

      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdit(): void {
    if (!this.patient) return;

    if (this.isEditing) {
      this.isEditing = false;
      return;
    }

    this.isEditing = true;
    this.editForm = {
      name:   this.patient.name   ?? '',
      email:  this.patient.email  ?? '',
      phone:  this.patient.phone  ?? '',
      age:    this.patient.age    ?? 0,
      weight: this.patient.weight ?? 0,
      height: this.patient.height ?? 0,
    };
  }

  saveEdit(): void {
    if (!this.patient) return;

    const updateData = {
      weight: this.editForm.weight ?? 0,
      height: this.editForm.height ?? 0,
      age:    this.editForm.age    ?? 0,
    };

    this.patientService.updatePatientProfile(updateData).subscribe({
      next: () => {
        this.patient = {
          ...this.patient!,
          ...this.editForm,
        };
        this.isEditing = false;
        this.cdr.detectChanges();
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Update failed. Please try again.';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
      }
    });
  }
}

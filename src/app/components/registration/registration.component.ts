import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  timeLeft = 300; // 5 minutos en segundos
  formExpired = false;
  isSubmitting = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  private timerSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.formExpired = true;
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  get minutes(): number {
    return Math.floor(this.timeLeft / 60);
  }

  get seconds(): number {
    return this.timeLeft % 60;
  }

  get formattedTime(): string {
    const mins = this.minutes.toString().padStart(2, '0');
    const secs = this.seconds.toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  onSubmit() {
    if (this.registrationForm.valid && !this.formExpired && !this.isSubmitting) {
      this.isSubmitting = true;
      this.showError = false;
      
      const formData = this.registrationForm.value;
      
      this.registrationService.createRegistration(formData).subscribe({
        next: (response) => {
          this.showSuccess = true;
          this.registrationForm.reset();
          this.isSubmitting = false;
          
          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError = true;
          this.errorMessage = 'Error al enviar el registro. Por favor intenta nuevamente.';
          console.error('Error:', error);
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('email')) return 'Email inválido';
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }

  resetTimer() {
  this.timeLeft = 300;
  this.formExpired = false;
  this.registrationForm.reset();
  this.startTimer();
}
}

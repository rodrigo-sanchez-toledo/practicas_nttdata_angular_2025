import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../shared/form-errors/form-errors';

@Component({
  selector: 'app-form-reactivo',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FormErrorsComponent],
  templateUrl: './form-reactivo.html',
  styleUrls: ['./form-reactivo.css']
})
export class FormReactivoComponent implements OnInit {
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), this.noNumbers.bind(this)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]),
    categoria: new FormControl('', [Validators.required])
  });

  submitted = false;
  initialFormValue: Record<string, unknown> = {};

  constructor() {}

  ngOnInit() {
    this.initialFormValue = JSON.parse(JSON.stringify(this.form.value));
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = true;
    }
  }

  get nombre() { return this.form.get('nombre'); }
  get email() { return this.form.get('email'); }
  get edad() { return this.form.get('edad'); }
  get categoria() { return this.form.get('categoria'); }

  onSubmit() {
    this.submitted = true;
    
    if (this.form.valid) {
      alert('¡Formulario enviado correctamente!');
      this.resetForm();
    }
  }

  resetForm(): void {
    this.form.reset();
    this.submitted = false;
    this.initialFormValue = this.form.value as Record<string, unknown>;
  }

  keepOnlyDigits(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
      const control = this.form.get('edad');
      control?.setValue(cleaned);
    }
  }

  noNumbers(control: AbstractControl): ValidationErrors | null {
    if (!control?.value) { return null; }
    const hasNumbers = /\d/.test(String(control.value));
    return hasNumbers ? { noNumbers: true } : null;
  }

  private hasUnsavedChanges(): boolean {
    return JSON.stringify(this.form.value) !== JSON.stringify(this.initialFormValue);
  }

  canDeactivate(): boolean {
    const hasChanges = this.hasUnsavedChanges();
    
    if (!hasChanges) {
      return true;
    }

    return window.confirm('Tienes cambios sin guardar. ¿Deseas continuar?');
  }
}
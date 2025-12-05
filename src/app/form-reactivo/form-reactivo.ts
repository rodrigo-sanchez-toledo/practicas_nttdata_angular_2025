import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-reactivo',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './form-reactivo.html',
  styleUrl: './form-reactivo.css',
})
export class FormReactivoComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  initialFormValue: any;

  constructor(private formBuilder: FormBuilder) {}

  // Validador personalizado para no permitir números
  noNumbers(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { noNumbers: true } : null;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), this.noNumbers.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      categoria: ['', Validators.required]
    });

    this.initialFormValue = this.form.value;
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get email() {
    return this.form.get('email');
  }

  get edad() {
    return this.form.get('edad');
  }

  get categoria() {
    return this.form.get('categoria');
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      alert('¡Formulario enviado correctamente!');
      this.form.reset();
      this.submitted = false;
      this.initialFormValue = this.form.value;
    }
  }

  canDeactivate(): boolean {
    return JSON.stringify(this.form.value) === JSON.stringify(this.initialFormValue);
  }
}

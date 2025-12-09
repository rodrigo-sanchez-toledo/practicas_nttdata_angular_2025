import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  templateUrl: './form-errors.html',
  styleUrls: ['./form-errors.css'] ,
})
export class FormErrorsComponent {
  @Input({ required: true }) control!: AbstractControl | null;
  @Input() submitted = false;
  @Input() id?: string;

  hasError(key: string): boolean {
    return !!(this.control && this.control.errors && this.control.errors[key]);
  }

  // Devuelve todas las keys de errores disponibles
  get errorKeys(): string[] {
    const errors: ValidationErrors | null | undefined = this.control?.errors;
    return errors ? Object.keys(errors) : [];
  }
}

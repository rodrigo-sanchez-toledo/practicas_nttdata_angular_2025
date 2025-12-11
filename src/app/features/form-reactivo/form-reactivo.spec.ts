import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormReactivoComponent } from './form-reactivo';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../shared/form-errors/form-errors';
import { vi } from 'vitest';

describe('FormReactivoComponent', () => {
  let component: FormReactivoComponent;
  let fixture: ComponentFixture<FormReactivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormReactivoComponent,
        ReactiveFormsModule,
        RouterLink,
        CommonModule,
        FormErrorsComponent
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormReactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.form.get('nombre')?.value).toBe('');
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('edad')?.value).toBe('');
      expect(component.form.get('categoria')?.value).toBe('');
    });

    it('should initialize submitted as false', () => {
      expect(component.submitted).toBe(false);
    });

    it('should save initial form value in ngOnInit', () => {
      expect(component.initialFormValue).toEqual({
        nombre: '',
        email: '',
        edad: '',
        categoria: ''
      });
    });

    it('should start with invalid form', () => {
      expect(component.form.valid).toBe(false);
    });
  });

  describe('Form getters', () => {
    it('should return control instances', () => {
      expect(component.nombre).toBe(component.form.get('nombre'));
      expect(component.email).toBe(component.form.get('email'));
      expect(component.edad).toBe(component.form.get('edad'));
      expect(component.categoria).toBe(component.form.get('categoria'));
    });
  });

  describe('Form validation', () => {
    it('should validate nombre as required', () => {
      const control = component.form.get('nombre');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate nombre minLength', () => {
      const control = component.form.get('nombre');
      control?.setValue('ab');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should validate nombre accepts valid input', () => {
      const control = component.form.get('nombre');
      control?.setValue('Juan');
      expect(control?.valid).toBe(true);
    });

    it('should reject nombre with numbers', () => {
      const control = component.form.get('nombre');
      control?.setValue('Juan123');
      expect(control?.hasError('noNumbers')).toBe(true);
    });

    it('should validate email format', () => {
      const control = component.form.get('email');
      control?.setValue('invalid-email');
      expect(control?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const control = component.form.get('email');
      control?.setValue('test@example.com');
      expect(control?.valid).toBe(true);
    });

    it('should validate edad minimum value', () => {
      const control = component.form.get('edad');
      control?.setValue(17);
      expect(control?.hasError('min')).toBe(true);
    });

    it('should validate edad maximum value', () => {
      const control = component.form.get('edad');
      control?.setValue(121);
      expect(control?.hasError('max')).toBe(true);
    });

    it('should accept valid edad', () => {
      const control = component.form.get('edad');
      control?.setValue(25);
      expect(control?.valid).toBe(true);
    });

    it('should validate categoria as required', () => {
      const control = component.form.get('categoria');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid categoria', () => {
      const control = component.form.get('categoria');
      control?.setValue('tech');
      expect(control?.valid).toBe(true);
    });
  });

  describe('keepOnlyDigits method', () => {
    it('should remove non-digit characters from input', () => {
      const input = document.createElement('input');
      input.value = 'abc123def456';

      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: input });

      component.keepOnlyDigits(event);

      expect(input.value).toBe('123456');
    });

    it('should not modify input if it only contains digits', () => {
      const input = document.createElement('input');
      input.value = '12345';

      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: input });

      component.keepOnlyDigits(event);

      expect(input.value).toBe('12345');
    });

    it('should update edad control value', () => {
      const input = document.createElement('input');
      input.value = 'a2b5';

      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: input });

      component.keepOnlyDigits(event);

      expect(component.form.get('edad')?.value).toBe('25');
    });
  });

  describe('onSubmit method', () => {
    it('should set submitted to true', () => {
      component.onSubmit();
      expect(component.submitted).toBe(true);
    });

    it('should not reset form if invalid', () => {
      component.form.get('nombre')?.setValue('');
      component.onSubmit();

      expect(component.form.get('nombre')?.value).toBe('');
    });

    it('should reset form if valid', () => {
      component.form.get('nombre')?.setValue('Juan');
      component.form.get('email')?.setValue('test@example.com');
      component.form.get('edad')?.setValue(25);
      component.form.get('categoria')?.setValue('tech');

      const alertSpy = vi.spyOn(window, 'alert');
      component.onSubmit();

      expect(alertSpy).toHaveBeenCalledWith('¡Formulario enviado correctamente!');
      expect(component.form.get('nombre')?.value).toBeNull();
    });
  });

  describe('resetForm method', () => {
    it('should reset all form controls', () => {
      component.form.get('nombre')?.setValue('Juan');
      component.form.get('email')?.setValue('test@example.com');

      component.resetForm();

      expect(component.form.get('nombre')?.value).toBeNull();
      expect(component.form.get('email')?.value).toBeNull();
    });

    it('should set submitted to false', () => {
      component.submitted = true;
      component.resetForm();

      expect(component.submitted).toBe(false);
    });

    it('should update initialFormValue', () => {
      component.form.get('nombre')?.setValue('Juan');
      component.resetForm();

      expect(component.initialFormValue).toEqual({
        nombre: null,
        email: null,
        edad: null,
        categoria: null
      });
    });
  });

  describe('canDeactivate method', () => {
    it('should return true when no changes', () => {
      expect(component.canDeactivate()).toBe(true);
    });

    it('should show confirm when there are changes', () => {
      component.form.get('nombre')?.setValue('Juan');
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      component.canDeactivate();

      expect(confirmSpy).toHaveBeenCalled();
    });

    it('should return true when user confirms', () => {
      component.form.get('nombre')?.setValue('Juan');
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      const result = component.canDeactivate();

      expect(result).toBe(true);
    });

    it('should return false when user cancels', () => {
      component.form.get('nombre')?.setValue('Juan');
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      const result = component.canDeactivate();

      expect(result).toBe(false);
    });
  });

  describe('noNumbers validator', () => {
    it('should reject values with numbers', () => {
      const control = component.form.get('nombre');
      control?.setValue('Juan123');

      expect(control?.hasError('noNumbers')).toBe(true);
    });

    it('should accept values without numbers', () => {
      const control = component.form.get('nombre');
      control?.setValue('Juan');

      expect(control?.hasError('noNumbers')).toBe(false);
    });

    it('should accept empty values', () => {
      const control = component.form.get('nombre');
      control?.setValue('');

      expect(control?.hasError('noNumbers')).toBe(false);
    });
  });
});

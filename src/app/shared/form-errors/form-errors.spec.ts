import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorsComponent } from './form-errors';

describe('FormErrorsComponent', () => {
  let component: FormErrorsComponent;
  let fixture: ComponentFixture<FormErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorsComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasError method', () => {
    it('should return true when control has error', () => {
      const control = new FormControl('', Validators.required);
      component.control = control;

      expect(component.hasError('required')).toBe(true);
    });

    it('should return false when control does not have error', () => {
      const control = new FormControl('valid value', Validators.required);
      component.control = control;

      expect(component.hasError('required')).toBe(false);
    });

    it('should return false when control is null', () => {
      component.control = null;

      expect(component.hasError('required')).toBe(false);
    });

    it('should return false when control has no errors object', () => {
      const control = new FormControl('valid', Validators.required);
      component.control = control;

      expect(component.hasError('nonexistent')).toBe(false);
    });
  });

  describe('errorKeys getter', () => {
    it('should return array of error keys', () => {
      const control = new FormControl('', Validators.required);
      component.control = control;

      const keys = component.errorKeys;
      expect(keys).toContain('required');
    });

    it('should return multiple error keys', () => {
      const control = new FormControl('ab', [
        Validators.required,
        Validators.minLength(3)
      ]);
      control.markAsTouched();
      component.control = control;

      const keys = component.errorKeys;
      expect(keys).toContain('minlength');
    });

    it('should return empty array when no errors', () => {
      const control = new FormControl('valid value', Validators.required);
      component.control = control;

      expect(component.errorKeys).toEqual([]);
    });

    it('should return empty array when control is null', () => {
      component.control = null;

      expect(component.errorKeys).toEqual([]);
    });
  });

  describe('template rendering', () => {
    it('should not display errors when control is valid', () => {
      const control = new FormControl('valid@email.com', [
        Validators.required,
        Validators.email
      ]);
      component.control = control;
      component.submitted = false;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv).toBeNull();
    });

    it('should display required error when submitted', () => {
      const control = new FormControl('', Validators.required);
      component.control = control;
      component.submitted = true;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv).toBeTruthy();
      expect(errorDiv?.textContent).toContain('Este campo es requerido');
    });

    it('should display email error', () => {
      const control = new FormControl('invalid-email', Validators.email);
      component.control = control;
      component.submitted = true;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv?.textContent).toContain('Introduce un correo válido');
    });

    it('should display minlength error', () => {
      const control = new FormControl('ab', Validators.minLength(3));
      component.control = control;
      component.submitted = true;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv?.textContent).toContain('Longitud mínima requerida');
    });

    it('should display min error', () => {
      const control = new FormControl(15, Validators.min(18));
      component.control = control;
      component.submitted = true;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv?.textContent).toContain('Valor menor al mínimo');
    });

    it('should display max error', () => {
      const control = new FormControl(150, Validators.max(120));
      component.control = control;
      component.submitted = true;
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv?.textContent).toContain('Valor mayor al máximo');
    });

    it('should display error when control is touched and invalid', () => {
      const control = new FormControl('', Validators.required);
      component.control = control;
      component.submitted = false;
      control.markAsTouched();
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv).toBeTruthy();
    });

    it('should apply id attribute to error div', () => {
      const control = new FormControl('', Validators.required);
      component.control = control;
      component.submitted = true;
      component.id = 'test-error-id';
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.form-errors');
      expect(errorDiv?.id).toBe('test-error-id');
    });
  });
});

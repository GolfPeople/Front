import { AbstractControl, ValidationErrors } from '@angular/forms';

export class MyValidations {
  static handicap(control: AbstractControl) {
    const value = parseFloat(control.value);
    if (value > 54) {
      return { isInvalid: true };
    }
    return null;
  }

  static decimal(control: AbstractControl) {
    const value = parseInt(control.value);
    if (value > 99) {
      return { invalidDecimal: true };
    }
    return false;
  }

  static matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }
}

import { AbstractControl } from '@angular/forms';

export class MyValidations {
  static handicap(control: AbstractControl) {
    const value = parseInt(control.value);
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
}

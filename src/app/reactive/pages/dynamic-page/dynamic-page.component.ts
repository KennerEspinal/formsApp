import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html',
  styles: ``
})
export class DynamicPageComponent {

  myForm: FormGroup = this.fB.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fB.array([
      ['Metal Gear Solid', Validators.required],
      ['The Legend of Zelda', Validators.required],
      ['Final Fantasy', Validators.required],
    ]),
  });

  newFavoriteGame: FormControl = new FormControl('', Validators.required);

  constructor(private fB: FormBuilder) { }

  get favoriteGamesArr() {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  isValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched;
  }

  isValidFieldArray(formArray: FormArray, i: number): boolean | null {
    return formArray.controls[i].errors
      && formArray.controls[i].touched;
  }

  getErrorMessage(field: string): string | null {
    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `This field must have at least ${errors['minlength'].requiredLength} characters`;
        case 'min':
          return 'This field must be greater than 0';
        default:
          return null;
      }
    }
    return null;
  }

  onDeleteFavoriteGame(i: number) {
    this.favoriteGamesArr.removeAt(i);
  }

  onAddFavoriteGame() {
    if (this.newFavoriteGame.invalid) return;

    const newGame = this.newFavoriteGame.value;

    this.favoriteGamesArr.push(
      this.fB.control(newGame, Validators.required)
    );

    this.newFavoriteGame.reset();

  }

  onSubmit() {

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);

    (this.myForm.controls['favoriteGames'] as FormArray) = this.fB.array([]);

    this.myForm.reset();
  }

}

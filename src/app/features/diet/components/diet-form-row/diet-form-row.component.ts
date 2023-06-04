import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Diet } from '@app/@core/models/diet/diet.model';

@Component({
  selector: 'app-diet-form-row',
  templateUrl: './diet-form-row.component.html',
  styleUrls: ['./diet-form-row.component.css']
})
export class DietFormRowComponent {
  @Input() diet: Diet;
  @Output() saveDiet = new EventEmitter<Diet>();
  dietForm: FormGroup;
  saved: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.dietForm = this.fb.group({
      breakfast: this.diet.meals.Breakfast,
      lunch: this.diet.meals.Lunch,
      dinner: this.diet.meals.Dinner,
      snack1: this.diet.meals.Snack1,
      snack2: this.diet.meals.Snack2,
      snack3: this.diet.meals.Snack3,
      rating: this.diet.rating
    });
  }

  get f() { return this.dietForm.controls; }

  onSubmit(){
    this.diet.meals.Breakfast = this.f['breakfast'].value;
    this.diet.meals.Lunch = this.f['lunch'].value;
    this.diet.meals.Dinner = this.f['dinner'].value;
    this.diet.meals.Snack1 = this.f['snack1'].value;
    this.diet.meals.Snack2 = this.f['snack2'].value;
    this.diet.meals.Snack3 = this.f['snack3'].value;
    this.diet.rating = this.f['rating'].value;
    this.saveDiet.emit(this.diet);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Diet } from '@app/@core/models/diet/diet.model';

/* 
TODO:
double check max length validation
*/
@Component({
  selector: 'app-diet-form-row',
  templateUrl: './diet-form-row.component.html',
  styleUrls: ['./diet-form-row.component.css']
})
export class DietFormRowComponent {
  @Input() diet: Diet;
  @Input() isAdmin: boolean = false;
  @Output() saveDiet = new EventEmitter<Diet>();
  dietForm: FormGroup;
  saved: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.dietForm = this.fb.group({
      breakfast: [{value: this.diet.meals.Breakfast, disabled: this.isAdmin }, [Validators.maxLength(499)]],
      lunch: [{ value: this.diet.meals.Lunch, disabled: this.isAdmin }, [Validators.maxLength(499)]],
      dinner: [{ value: this.diet.meals.Dinner, disabled: this.isAdmin }, [Validators.maxLength(499)]],
      snack1: [{ value: this.diet.meals.Snack1, disabled: this.isAdmin }, [Validators.maxLength(499)]],
      snack2: [{ value: this.diet.meals.Snack2, disabled: this.isAdmin }, [Validators.maxLength(499)]],
      snack3: [{ value: this.diet.meals.Snack3, disabled: this.isAdmin }, [Validators.maxLength(499)]],
      rating: { value: this.diet.rating, disabled: this.isAdmin }
    });
  }

  get f() { return this.dietForm.controls; }

  onSubmit(){
    if(this.isAdmin){
      return;
    }
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

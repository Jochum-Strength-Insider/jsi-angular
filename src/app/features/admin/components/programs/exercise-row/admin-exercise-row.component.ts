import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Exercise } from '@app/@core/models/program/exercise.model';
import { Tracking } from '@app/@core/models/program/tracking.model';

@Component({
  selector: 'app-admin-exercise-row',
  templateUrl: './admin-exercise-row.component.html',
  styleUrls: ['./admin-exercise-row.component.css']
})
export class AdminExerciseRowComponent {
  @Input() exercise: Exercise;
  @Output() showModal = new EventEmitter<Exercise>();
  @Output() saveTracking = new EventEmitter();
  trackingForm: FormGroup;
  isCollapsed: boolean = true;
  isModalOpen: boolean = false;
  modalExercise: Exercise;
  saved: boolean = false;
  error: Error;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.trackingForm = this.fb.group({
      week1: this.exercise.tracking['week 1'],
      week2: this.exercise.tracking['week 2'],
      week3: this.exercise.tracking['week 3'],
    });
  }

  get f() { return this.trackingForm.controls; }

  setModal(exercise: Exercise){
    this.showModal.emit(exercise);
  }

  onSubmit(){
    const tracking = new Tracking();
    tracking['week 1'] = this.f['week1'].value;
    tracking['week 2'] = this.f['week2'].value;
    tracking['week 3'] = this.f['week3'].value;
    this.exercise.tracking = tracking;
    this.saveTracking.emit();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Day } from '@app/@core/models/program/day.model';
import { ExerciseKeys } from '@app/@core/models/program/exercise.model';
import { ProgramCell } from '@app/@core/models/program/program-cell';
import { Tasks } from '@app/@core/models/program/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-day-table',
  templateUrl: './admin-day-table.component.html',
  styleUrls: ['./admin-day-table.component.css']
})
export class AdminDayTableComponent implements OnInit, OnDestroy {
  @Input() dayFormGroup: FormGroup;
  @Input() dayIndex: number = 0;
  @Input() uid: string;
  @Input() tasks: Tasks[] = [];

  selectedCell: ProgramCell | null = null;
  
  addAtIndex: number = -1;
  error: Error;

  inputCtrl = new FormControl();
  inputCtrlSub: Subscription;
  daysFormSub: Subscription;

  constructor(private fb: FormBuilder){ }

  ngOnInit(): void {
    this.inputCtrlSub = this.inputCtrl.valueChanges
    .subscribe( value => {
      if(this.selectedCell){
        this.handleValueChanged(value);
      }
    })

    this.daysFormSub = this.dayFormGroup.valueChanges.subscribe(
      value => {
        if(this.selectedCell) {
          const formValue = value as Day;
          if(this.selectedCell.name !== 'tracking') {
            const exercise = formValue.exercises[this.selectedCell.rowIndex]
            const value = exercise[this.selectedCell.name];
            this.inputCtrl.patchValue(value, { emitEvent: false })
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.inputCtrlSub?.unsubscribe();
    this.daysFormSub?.unsubscribe();
  }

  get daysExercises(): FormArray {
    return this.dayFormGroup.get("exercises") as FormArray
  }

  getExerciseAtIndex(rowIndex: number) : FormGroup {
    return this.daysExercises.controls.at(rowIndex) as FormGroup;
  }

  getExerciseValue(rowIndex: number, name: ExerciseKeys) : string {
    return this.getExerciseAtIndex(rowIndex)?.get(name)?.value || ""
  }

  getExerciseTrackingAtIndex(rowIndex: number) : FormGroup {
    return this.daysExercises.controls.at(rowIndex)?.get('tracking') as FormGroup;
  }

  selectedDaysCellValue(): string {
    if(this.selectedCell === null){
      return "";
    }
    const { rowIndex, name } = this.selectedCell;
    return this.getExerciseValue(rowIndex, name) || "";
  }


  setCurrentCell(rowIndex: number, name: ExerciseKeys) {
    this.selectedCell = null;
    const number =  this.getExerciseValue(rowIndex, 'Number');
    const value =  this.getExerciseValue(rowIndex, name);
    this.selectedCell = new ProgramCell(this.dayIndex, rowIndex, name, number, value)
    this.inputCtrl.patchValue(value, { emitEvent: false });
  }

  handleValueChanged(event: string) {
    if(this.selectedCell === null) { return; }
    const { rowIndex, name } = this.selectedCell;
    const exerciseForm = this.getExerciseAtIndex(rowIndex);
    exerciseForm.get(name)?.patchValue(event, { emitEvent: false });
  }

  handleSelectionChanged(event: Tasks) {
    if(this.selectedCell){
      const exerciseForm = this.getExerciseAtIndex(this.selectedCell.rowIndex);
      exerciseForm.get("Description")?.patchValue(event.e, { emitEvent: false });
      exerciseForm.get("Link")?.patchValue(event.l);
    }
  }

  handleAddRow() {
    const newRowGroup = this.fb.group({
      Number: ["1", Validators.required],
      Description: ["", Validators.required],
      Link: ["", Validators.required],
      Sets: ["3", Validators.required],
      Reps: ["5", Validators.required],
      Rest: [":00", Validators.required],
      Tempo: ["3-3-0", Validators.required],
      tracking: this.fb.group({
        'week 1': [""],
        'week 2': [""],
        'week 3': [""],
      })
    });

    if(this.addAtIndex == -1){
      this.daysExercises.push(newRowGroup);
    } else {
      this.daysExercises.insert(this.addAtIndex, newRowGroup);
    }
  }

  handleRemoveSpecificRow(index: number){
    if(this.selectedCell && this.selectedCell.rowIndex == index){
      this.selectedCell = null;
    }
    this.daysExercises.removeAt(index);
  }
}
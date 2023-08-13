import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Day } from '@app/@core/models/program/day.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { Program } from '@app/@core/models/program/program.model';
import { Tasks } from '@app/@core/models/program/task.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { mapWorkoutToPhases } from '@app/@core/utilities/programs.utilities';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { AdminPhaseTableComponent } from '../phase-table/admin-phase-table.component';

@Component({
  selector: 'app-admin-program-table',
  templateUrl: './admin-program-table.component.html',
  styleUrls: ['./admin-program-table.component.css']
})
export class AdminProgramTableComponent implements OnInit, OnChanges {
  @ViewChildren(AdminPhaseTableComponent) phaseTables: QueryList<AdminPhaseTableComponent>
  @Input() program: Workout | Program;
  @Input() uid: string;
  @Input() tasks: Tasks[] = [];
  @Output() savePhase = new EventEmitter<Phase>();
  phases: Phase[];
  active = 0;

  ngOnInit(): void {
    this.phases = mapWorkoutToPhases(this.program);
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['program'], () => this.phases = mapWorkoutToPhases(changes['program'].currentValue))
  }

  handleSavePhase(event: Phase){
    console.log('programTable sae phase')
    this.savePhase.emit(event);
  }
}

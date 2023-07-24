import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Day } from '@app/@core/models/program/day.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { Program } from '@app/@core/models/program/program.model';
import { Tasks } from '@app/@core/models/program/task.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';

@Component({
  selector: 'app-admin-program-table',
  templateUrl: './admin-program-table.component.html',
  styleUrls: ['./admin-program-table.component.css']
})
export class AdminProgramTableComponent implements OnInit, OnChanges {
  @Input() program: Workout | Program;
  @Input() uid: string;
  @Input() tasks: Tasks[] = [];
  @Output() savePhase = new EventEmitter<Phase>();
  phases: Phase[];
  active = 0;

  ngOnInit(): void {
    this.mapWorkoutToPhases(this.program);
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['program'], () => this.mapWorkoutToPhases(changes['program'].currentValue))
  }

  mapWorkoutToPhases(program: Workout | Program) {
    const { instruction } = program;
    const phasesList: string[] = Object.keys(program.instruction);
    this.phases = phasesList.map((key: string) => {
      const { completed, ...days } = instruction[key];
      const daysArray: Day[] = Object.keys(days).map((key) => {
          const { exercises, title, image } = days[key];
          return ({
            id: key,
            title,
            image,
            exercises: JSON.parse(exercises)
          });
      });
      return ({ title: key, days: daysArray })
    });
  }

  handleSavePhase(event: Phase){
    this.savePhase.emit(event);
  }
}

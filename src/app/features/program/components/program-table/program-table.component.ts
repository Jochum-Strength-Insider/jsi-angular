import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Day } from '@app/@core/models/program/day.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';

@Component({
  selector: 'app-program-table',
  templateUrl: './program-table.component.html',
  styleUrls: ['./program-table.component.css']
})
export class ProgramTableComponent implements OnInit, OnChanges {
  @Input() program: Workout;
  @Input() uid: string;
  @Output() saveTracking = new EventEmitter<{phase: string, day: string; item: string }>();
  phases: Phase[];
  active = 0;

  ngOnInit(): void {
    this.mapWorkoutToPhases(this.program);
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['program'], () => this.mapWorkoutToPhases(changes['program'].currentValue))
  }

  mapWorkoutToPhases(program: Workout){
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
}

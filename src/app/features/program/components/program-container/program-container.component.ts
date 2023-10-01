import { Component, Input, OnDestroy } from '@angular/core';
import { Workout } from '@app/@core/models/program/workout.model';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { Subscription, of, switchMap } from 'rxjs';
import { WorkoutService } from '../../services/workout.service';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-program-container',
  templateUrl: './program-container.component.html',
  styleUrls: ['./program-container.component.css']
})
export class ProgramContainerComponent implements OnDestroy {
  @Input() user: User;
  programSub: Subscription;
  program: Workout;
  programKey: string;
  error: Error | null;

  constructor(
    private service: WorkoutService,
    private lsService: LocalStorageService
  ){
    this.program = this.lsService.getParseData('program');
  }

  ngOnInit(): void {
    this.program = this.lsService.getParseData('program');

    this.programSub = this.service
      .getActiveWorkoutId(this.user.id)
      .pipe(
        switchMap((wid) => {
          if(wid.length > 0){
            return this.service.getWorkout(this.user.id, wid[0].id)
          } else {
            this.lsService.removeData('program');
            return of();
          }
        })
      )
      .subscribe({
        next: result => {
            this.program = result;
            this.programKey = result?.id;
            this.lsService.saveStringifyData('program', result);
            this.lsService.saveData('programKey', result.id);
        },
        error: error => {
          this.error = error;
          this.clearWorkout();
        }
      })
  }

  clearWorkout() {
    this.lsService.removeData('program');
    this.lsService.removeData('programKey');
    this.programKey = '';
  }

  ngOnDestroy(): void {
    this.programSub.unsubscribe();
  }
}

import { Component, Input, OnDestroy } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { Subscription, of, switchMap, take } from 'rxjs';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-program-container',
  templateUrl: './program-container.component.html',
  styleUrls: ['./program-container.component.css']
})
export class ProgramContainerComponent implements OnDestroy {
  @Input() user: User;
  programSub: Subscription;
  program: Workout;
  loaded: boolean = false;

  constructor(
    private service: WorkoutService,
    private errorService: ErrorHandlingService
  ){}

  ngOnInit(): void {
    this.programSub = this.service
      .getActiveWorkoutId(this.user.id)
      .pipe(
        // Leave take(1) commented out until you can verify
        // that the oninit will fire consistently on mobile
        // take(1),
        switchMap((ids) => {
          if(ids.length > 0){
            console.log('Program Id: ', ids.map(wid => wid.id));
            return this.service.getWorkout(this.user.id, ids[0].id)
          } else {
            console.log('No Active Programs')
            return of();
          }
        })
      )
      .subscribe({
        next: (result) => {
          console.log('Program: ', result.title);
          this.program = result;
          this.loaded = true;
        },
        error: (err) => {
          this.errorService.generateError(
            err,
            'Get Program',
            `An error occurred while trying to retreive your program. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues: ${err.message}`
          );
        }
      })
  }

  ngOnDestroy(): void {
    this.programSub.unsubscribe();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { Observable, Subscription, filter, map, mergeMap, switchMap } from 'rxjs';
import { ProgramService } from '../../services/program.service';

@Component({
  selector: 'app-program-page',
  templateUrl: './program-page.component.html',
  styleUrls: ['./program-page.component.css']
})
export class ProgramPageComponent implements OnDestroy {
  authUser$: Observable<User | null>;
  programSub: Subscription;
  program: Workout;
  programKey: string;
  error: Error | null;
  uid: string;

  constructor(
    private authService: AuthService,
    private programService: ProgramService,
    private lsService: LocalStorageService
  ){
    this.authUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.program = this.lsService.getParseData('program');
    this.programKey = this.lsService.getData('programKey');

    this.programSub = this.authUser$.pipe(
      filter(user => !!user),
      mergeMap(user => {
        return this.programService.getActiveWorkoutId(user!.id)
          .pipe(
            map(workout => {
              return {uid: user!.id, wid: workout[0].id};
            })
          )
      }),
      switchMap(
        ({uid, wid}) => {
          this.uid = uid
          return this.programService.getWorkout(uid, wid)
        }
      )
    )
    .subscribe({
      next: result => {
          this.program = result;
          this.programKey = result.id;
          this.lsService.saveStringifyData('program', result);
          this.lsService.saveData('programKey', result.id);
      },
      error: error => {
        console.log(error)
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
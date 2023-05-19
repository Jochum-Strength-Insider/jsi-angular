import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Day } from '@app/@core/models/program/day.model';
import { Program } from '@app/@core/models/program/program.model';
import { Workout, WorkoutListItem } from '@app/@core/models/program/workout.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { BehaviorSubject, Observable, from, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  programsSub = new BehaviorSubject<Program[]>([]);
  programs$ = this.programsSub.asObservable();
  
  workoutSub = new BehaviorSubject<Workout | null>(null);
  workout$ = this.workoutSub.asObservable();

  constructor(
    private db: AngularFireDatabase
  ) { }

  // Make the reference current workout reference a variable that can be reused.

  // // *** WorkoutIds API ***

  // workoutIds = uid => this.db.ref(`workoutids/${uid}`);
  getWorkoutIds(uid: string):Observable<WorkoutListItem[]> {
    return <Observable<WorkoutListItem[]>>this.db.list(`workoutids/${uid}`)
      .valueChanges([], { idField: 'id' });
  }

  // workoutId = (uid, wid) => this.db.ref(`workoutids/${uid}/${wid}`);
  getWorkoutId(uid: string, wid: string):Observable<WorkoutListItem> {
    return <Observable<WorkoutListItem>>this.db.object(`workoutids/${uid}/${wid}`)
      .valueChanges();
  }

  getActiveWorkoutId(uid: string):Observable<WorkoutListItem[]> {
    const activeWorkoutIdRef = this.db.list(
      `workoutids/${uid}`,
      ref => ref.orderByChild("active").equalTo(true).limitToFirst(1)
    );

    return <Observable<WorkoutListItem[]>>activeWorkoutIdRef
      .valueChanges([], { idField: 'id' });
  }

  // // *** Workout API ***

  // workouts = (uid) => this.db.ref(`workouts/${uid}`);
  getWorkouts(uid: string):Observable<Workout[]> {
    return <Observable<Workout[]>>this.db.list(`workouts/${uid}`)
      .valueChanges();
  }

  // workout = (uid, wid) => this.db.ref(`workouts/${uid}/${wid}`);
  getWorkout(uid: string, wid: string):Observable<Workout> {
    return <Observable<Workout>>this.db.object(`workouts/${uid}/${wid}`)
      .snapshotChanges()
      .pipe(
        take(1),
        mapKeyToObjectOperator(),
        tap( (workout: Workout) => {
          this.workoutSub.next(workout);
        })
      );
  }

  saveWorkoutTracking(uid: string, wid: string, phase: String, day: Day) : Observable<void>{
    const updateRef = this.db.object(`workouts/${uid}/${wid}/instruction/${phase}`);
    const dayObject = {
      exercises: JSON.stringify(day.exercises),
      title: day.title,
      image: day.image
    }

    return from(updateRef.update({ [day.id]: dayObject }));
  }
}

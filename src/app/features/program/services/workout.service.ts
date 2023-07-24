import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Day } from '@app/@core/models/program/day.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { Observable, defer, first } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  constructor(
    private db: AngularFireDatabase
  ) { }

  // // *** WorkoutIds API ***

  private workoutIdsListRef(uid: string): AngularFireList<WorkoutId> {
    return this.db.list(`workoutids/${uid}`)
  }
  
  private workoutIdsObjectRef(uid: string, wid: string): AngularFireObject<WorkoutId> {
    return this.db.object(`workoutids/${uid}/${wid}`)
  }

  getWorkoutIds(uid: string): Observable<WorkoutId[]> {
    return this.workoutIdsListRef(uid)
      .valueChanges([], { idField: 'id' });
  }

  getWorkoutId(uid: string, wid: string): Observable<WorkoutId> {
    return this.workoutIdsObjectRef(uid, wid)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getActiveWorkoutId(uid: string):Observable<WorkoutId[]> {
    const activeWorkoutIdRef = this.db.list(
      `workoutids/${uid}`,
      ref => ref.orderByChild("active").equalTo(true).limitToFirst(1)
    );

    return <Observable<WorkoutId[]>>activeWorkoutIdRef
      .valueChanges([], { idField: 'id' });
  }

  // // *** Workout API ***

  private workoutListRef(uid: string): AngularFireList<Workout> {
    return this.db.list(`workouts/${uid}`)
  }
  
  private workoutObjectRef(uid: string, wid: string): AngularFireObject<Workout> {
    return this.db.object(`workouts/${uid}/${wid}`)
  }

  getWorkouts(uid: string):Observable<Workout[]> {
    return this.workoutListRef(uid)
      .valueChanges();
  }

  getWorkout(uid: string, wid: string): Observable<Workout> {
    return this.workoutObjectRef(uid, wid)
      .snapshotChanges()
      .pipe(
        first(),
        mapKeyToObjectOperator()
      );
  }

  saveWorkoutTracking(uid: string, wid: string, phase: String, day: Day) : Observable<void>{
    const updateRef = this.db.object(`workouts/${uid}/${wid}/instruction/${phase}`);
    const dayObject = {
      exercises: JSON.stringify(day.exercises),
      title: day.title,
      image: day.image
    }

    return defer(() => updateRef.update({ [day.id]: dayObject }));
  }

}
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Day } from '@app/@core/models/program/day.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { mapPhaseArrayToObject, programObjectFromProgram } from '@app/@core/utilities/programs.utilities';
import { Observable, defaultIfEmpty, defer, first, forkJoin, map, mergeMap, of, switchMap, tap } from 'rxjs';

export const WORKOUTS_STRING = 'workouts';
export const WORKOUT_ID_STRING = 'workoutids';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  constructor(
    private db: AngularFireDatabase
  ) { }

  // // *** WorkoutIds API ***

  private workoutIdsListRef(uid: string): AngularFireList<WorkoutId> {
    return this.db.list(`${WORKOUT_ID_STRING}/${uid}`)
  }
  
  private workoutIdsObjectRef(uid: string, wid: string): AngularFireObject<WorkoutId> {
    return this.db.object(`${WORKOUT_ID_STRING}/${uid}/${wid}`)
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
      `${WORKOUT_ID_STRING}/${uid}`,
      ref => ref.orderByChild("active").equalTo(true).limitToFirst(1)
    );

    return <Observable<WorkoutId[]>>activeWorkoutIdRef
      .valueChanges([], { idField: 'id' });
  }

  setWorkoutIsActive(uid: string, wid: string, activate: boolean): Observable<void> {
    if(activate){
        return this.getActiveWorkoutId(uid).pipe(
          first(),
          mergeMap((workouts) => 
            forkJoin(
              workouts.map(
                workout => forkJoin([
                  defer(() => this.workoutIdsListRef(uid).update(workout.id, {active: false}))
                ]).pipe(defaultIfEmpty(null))
              )
          ).pipe(defaultIfEmpty(null))),
          switchMap(
            () => defer(() => this.workoutIdsListRef(uid).update(wid, {active: true}))
          )
        )
    }
    return defer(() => this.workoutIdsListRef(uid).update(wid, {active: false}));
  }


  // // *** Workout API ***

  private workoutListRef(uid: string): AngularFireList<Workout> {
    return this.db.list(`${WORKOUTS_STRING}/${uid}`)
  }
  
  private workoutObjectRef(uid: string, wid: string): AngularFireObject<Workout> {
    return this.db.object(`${WORKOUTS_STRING}/${uid}/${wid}`)
  }

  private workoutInstructionObjectRef(uid: string, pid: string): AngularFireObject<Workout> {
    return this.db.object(`${WORKOUTS_STRING}/${uid}/${pid}/instruction`)
  }

  getWorkouts(uid: string):Observable<Workout[]> {
    return this.workoutListRef(uid)
      .valueChanges();
  }

  public getWorkout(uid: string, wid: string): Observable<Workout> {
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

  removeWorkout(uid: string, wid: string): Observable<void> {
    return defer( () => this.workoutIdsObjectRef(uid, wid).remove())
      .pipe(
        switchMap(() => defer( () => this.workoutObjectRef(uid, wid).remove()))
      )
  }

  updateWorkoutTitle(uid: string, wid: string, title: string): Observable<void> {
    return defer( () => this.workoutObjectRef(uid, wid).update({title}) )
      .pipe(
        switchMap(() => defer( () => this.workoutIdsObjectRef(uid, wid).update({title}) ))
      )
  }

  saveWorkoutWithPhaseUpdate(uid: string, pid: string, phase: Phase): Observable<void> {
    const phaseUpdate = mapPhaseArrayToObject(phase);
    return defer(() => this.workoutInstructionObjectRef(uid, pid).update({ [phase.title]: phaseUpdate }));
  }

  addUserWorkout(workout: Workout | any, uid: string): Observable<string | null> {
    return of(this.workoutListRef(uid).push(workout).key)
      .pipe(
        switchMap((key) => {
          if(key) {
            return of(this.workoutIdsListRef(uid).set(key, new WorkoutId(workout.title, workout.createdAt)))
            .pipe(map(() => key))
          } else {
            return of();
          }
        })
      )
  }

  public removeUserWorkouts(uid: string): Observable<void> {
    return defer( () => this.workoutListRef(uid).remove())
    .pipe(
      switchMap(() => defer(() => this.workoutIdsListRef(uid).remove()))
    )
  }
}
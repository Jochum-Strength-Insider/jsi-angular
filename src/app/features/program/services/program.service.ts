import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Day } from '@app/@core/models/program/day.model';
import { Folder } from '@app/@core/models/program/folder.model';
import { ProgramId } from '@app/@core/models/program/program-id.model';
import { DEFAULT_PROGRAM, Program } from '@app/@core/models/program/program.model';
import { Tasks } from '@app/@core/models/program/task.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { Observable, defaultIfEmpty, defer, first, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';

/* TO DO:
Split up into smaller services
Split into public user and private admin program services
*/

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
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

  // // *** Tasks API ***

  private tasksListRef(): AngularFireList<Tasks> {
    return this.db.list(`tasks`)
  }
  
  private tasksObjectRef(tid: string): AngularFireObject<Tasks> {
    return this.db.object(`tasks/${tid}`)
  }

  getTasks():Observable<Tasks[]> {
    const tasksRef = this.db.list(`/tasks`, ref => ref.orderByChild("e"));
    return <Observable<Tasks[]>>tasksRef
      .valueChanges([], { idField: 'id' })
  }

  getTasksWithLimit(limit: number = 10, startAt: string = ''):Observable<Tasks[]> {
    const tasksRef = this.db.list(`/tasks`,
    ref => ref
      .orderByChild('e')
      .startAt(startAt)
      .limitToFirst(limit)
    );

    return <Observable<Tasks[]>>tasksRef
      .valueChanges([], { idField: 'id' })
  }
  
  getTask(task: Tasks):Observable<Tasks> {
    return this.tasksObjectRef(task.id)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  removeTask(task: Tasks) : Observable<void> {
    return defer( () => this.tasksObjectRef(task.id).remove())
  }

  addTask(task: Tasks): Observable<string | null>  {
    return of(this.tasksListRef().push(task).key)
  }

  saveTask(task: Tasks): Observable<void> {
    const { id, ...taskObject } = task;
    const updateRef = this.tasksObjectRef(id);
    return defer( () => updateRef.update({ ...taskObject }));
  }

  // // *** Folders API ***

  private foldersListRef(): AngularFireList<Folder> {
    return this.db.list(`folders`)
  }
  
  private foldersObjectRef(fid: string): AngularFireObject<Folder> {
    return this.db.object(`folders/${fid}`)
  }

  getFolder(fid: string): Observable<Folder> {
    return this.foldersObjectRef(fid)
    .snapshotChanges()
    .pipe( mapKeyToObjectOperator() );
  }

  getFolders(): Observable<Folder[]> {
    return this.foldersListRef()
      .valueChanges([], { idField: 'id' })
  }

  removeFolder(folder: Folder) : Observable<void> {
    return this.getProgramIdsByFolder(folder.id).pipe(
      first(),
      mergeMap((programs) => 
        forkJoin(
          programs.map(
            program => forkJoin([
              defer(() => this.programIdsListRef().update(program.id, { parentFolderId: null })),
              defer(() => this.programsListRef().update(program.id, { parentFolderId: null }))
            ]).pipe(defaultIfEmpty(null))
          )
      ).pipe(defaultIfEmpty(null))),
      switchMap(() => defer( () => this.foldersObjectRef(folder.id).remove() ) )
    )
  }

  addFolder(folder: Folder): Observable<string | null>  {
    return of(this.foldersListRef().push(folder).key)
  }

  saveFolder(folder: Folder): Observable<void> {
    const { id, ...folderObject } = folder;
    const updateRef = this.foldersObjectRef(id);
    return defer(() => updateRef.update({ ...folderObject }));
  }

  // // *** Programs API ***

  private programsListRef(): AngularFireList<Program> {
    return this.db.list(`programs`)
  }
  
  private programsObjectRef(pid: string): AngularFireObject<Program> {
    return this.db.object(`programs/${pid}`)
  }

  createProgram(title: string, parentFolderId: string | null = null): Observable<string | null> {
    const program = DEFAULT_PROGRAM(title, parentFolderId);
    return of(this.programsListRef().push(program).key)
      .pipe(
        switchMap((key) => {
          if(key) {
            return of(this.programIdsListRef().set(key, new ProgramId(title, parentFolderId)))
            .pipe(map(() => key))
          } else {
            return of();
          }
        })
      )
  }

  removeProgram(program: Program | ProgramId) : Observable<void> {
    return defer( () => this.programIdsObjectRef(program.id).remove())
      .pipe(
        switchMap(() => defer( () => this.programsObjectRef(program.id).remove()))
      )
  }

  addProgramToFolder(programId: string, parentFolderId: string): Observable<void> {
    return defer( () => this.programsObjectRef(programId).update({parentFolderId: parentFolderId}))
      .pipe(
        switchMap(() => {
          return defer(() => this.programIdsObjectRef(programId).update({parentFolderId: parentFolderId}))
        })
      )
  }

  // // *** ProgramIds API ***
  
  private programIdsListRef(): AngularFireList<ProgramId> {
    return this.db.list(`programIds`)
  }
  
  private programIdsObjectRef(pid: string): AngularFireObject<ProgramId> {
    return this.db.object(`programIds/${pid}`)
  }

  getProgramIds():Observable<ProgramId[]> {
    return this.programIdsListRef()
      .valueChanges([], { idField: 'id' })
  }

  getProgramIdsByFolder(fid: string | null):Observable<ProgramId[]> {
    const programIdsRef = this.db.list(`/programIds`, ref => ref.orderByChild('parentFolderId').equalTo(fid));
    return <Observable<ProgramId[]>>programIdsRef
      .valueChanges([], { idField: 'id' })
  }

}

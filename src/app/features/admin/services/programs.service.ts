import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Folder } from '@app/@core/models/program/folder.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { ProgramId } from '@app/@core/models/program/program-id.model';
import { DEFAULT_PROGRAM, Program } from '@app/@core/models/program/program.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { mapPhaseArrayToObject, programObjectFromProgram } from '@app/@core/utilities/programs.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { Observable, defaultIfEmpty, defer, first, forkJoin, map, mergeMap, of, switchMap, tap } from 'rxjs';

export const FOLDERS_STRING = 'folders';
export const PROGRAM_STRING = 'programs';
export const PROGRAM_IDS_STRING = 'programIds';
export const QUICK_SAVE_STRING = 'quickSave';
export const QUICK_SAVE_ID_STRING = 'quickSaveId';


@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService,
    private workoutService: WorkoutService
  ) { }

  // // *** Folders API ***

  private foldersListRef(): AngularFireList<Folder> {
    return this.db.list(FOLDERS_STRING)
  }
  
  private foldersObjectRef(fid: string): AngularFireObject<Folder> {
    return this.db.object(`${FOLDERS_STRING}/${fid}`)
  }

  getFolder(fid: string): Observable<Folder> {
    return this.foldersObjectRef(fid)
    .snapshotChanges()
    .pipe( mapKeyToObjectOperator() );
  }

  getFolders(): Observable<Folder[]> {
    return this.foldersListRef()
      .valueChanges([], { idField: 'id' })
      .pipe(
        tap((folders) => this.lsService.saveStringifyData(FOLDERS_STRING, folders)),
        map(folders => folders)
      )
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
      switchMap(() => defer( () => this.foldersObjectRef(folder.id).remove() ) ),
      tap(() => this.lsService.removeData(FOLDERS_STRING) )
    )
  }

  addFolder(folder: Folder): Observable<string | null>  {
    return of(this.foldersListRef().push(folder).key)
      .pipe( tap(() => this.lsService.removeData(FOLDERS_STRING)) )
  }

  saveFolder(folder: Folder): Observable<void> {
    const { id, ...folderObject } = folder;
    const updateRef = this.foldersObjectRef(id);
    return defer( () => updateRef.update({ ...folderObject }) )
      .pipe( tap(() => this.lsService.removeData(FOLDERS_STRING)) );
  }

  // // *** Programs API ***

  private programsListRef(): AngularFireList<Program> {
    return this.db.list(PROGRAM_STRING)
  }
  
  private programsObjectRef(pid: string): AngularFireObject<Program> {
    return this.db.object(`${PROGRAM_STRING}/${pid}`)
  }

  private programsInstructionObjectRef(pid: string): AngularFireObject<Program> {
    return this.db.object(`${PROGRAM_STRING}/${pid}/instruction`)
  }

  getProgram(pid: string): Observable<Program> {
    return this.programsObjectRef(pid)
      .snapshotChanges()
      .pipe(
        mapKeyToObjectOperator()
      );
  }

  addProgram(program: Program | any): Observable<string | null> {
    return of(this.programsListRef().push(program).key)
      .pipe(
        switchMap((key) => {
          if(key) {
            return of(this.programIdsListRef().set(key, new ProgramId(program.title, program.parentFolderId, program.createdAt)))
            .pipe(map(() => key))
          } else {
            return of();
          }
        }),
        tap(() => this.lsService.removeData(PROGRAM_IDS_STRING) )
      )
  }

  createDefaultProgram(title: string, parentFolderId: string | null = null): Observable<string | null> {
    const program = DEFAULT_PROGRAM(title, parentFolderId);
    return this.addProgram(program)
    .pipe(
      tap(() => this.lsService.removeData(PROGRAM_IDS_STRING) )
    );
  }

  saveProgramWithPhaseUpdate(pid: string, phase: Phase): Observable<void> {
    const phaseUpdate = mapPhaseArrayToObject(phase);
    return defer(() => this.programsInstructionObjectRef(pid).update({ [phase.title]: phaseUpdate }));
  }

  removeProgram(programId: string) : Observable<void> {
    return defer( () => this.programIdsObjectRef(programId).remove())
      .pipe(
        switchMap(() => defer( () => this.programsObjectRef(programId).remove())),
        tap(() => {
          this.lsService.removeData(PROGRAM_IDS_STRING);
        })
      )
  }

  addProgramToFolder(programId: string, parentFolderId: string): Observable<void> {
    return defer( () => this.programsObjectRef(programId).update({ parentFolderId }))
      .pipe(
        switchMap(() => {
          return defer(() => this.programIdsObjectRef(programId).update({ parentFolderId }))
        }),
        tap(() => this.lsService.removeData(PROGRAM_IDS_STRING) )
      )
  }

  updateProgramFolderAndTitle(programId: string, title: string, parentFolderId: string | null = null): Observable<void> {
    return defer( () => this.programsObjectRef(programId).update({title, parentFolderId}))
      .pipe(
        switchMap(() => {
          return defer(() => this.programIdsObjectRef(programId).update({title, parentFolderId}))
        }),
        tap(() => this.lsService.removeData(PROGRAM_IDS_STRING) )
      )
  }

  // // *** ProgramIds API ***
  
  private programIdsListRef(): AngularFireList<ProgramId> {
    return this.db.list(PROGRAM_IDS_STRING)
  }
  
  private programIdsObjectRef(pid: string): AngularFireObject<ProgramId> {
    return this.db.object(`${PROGRAM_IDS_STRING}/${pid}`)
  }

  getProgramIds():Observable<ProgramId[]> {
    return this.programIdsListRef()
      .valueChanges([], { idField: 'id' })
      .pipe(
        tap((programIds) => this.lsService.saveStringifyData(PROGRAM_IDS_STRING, programIds) )
      )
  }

  getProgramIdsByFolder(fid: string | null):Observable<ProgramId[]> {
    const programIdsRef = this.db.list(`/${PROGRAM_IDS_STRING}`, ref => ref.orderByChild('parentFolderId').equalTo(fid));
    return <Observable<ProgramId[]>>programIdsRef
      .valueChanges([], { idField: 'id' })
  }

  // // *** quickSave API ***
  
  private quickSaveObjectRef(): AngularFireObject<Program> {
    return this.db.object(QUICK_SAVE_STRING)
  }
  
  private quickSaveIdObjectRef(): AngularFireObject<ProgramId> {
    return this.db.object(QUICK_SAVE_ID_STRING)
  }

  getQuickSave():Observable<Program> {
    return <Observable<Program>>this.db.object(`quickSave`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getQuickSaveId():Observable<ProgramId> {
    return <Observable<ProgramId>>this.db.object(`quickSaveId`)
      .snapshotChanges()
      .pipe(
        mapKeyToObjectOperator(),
        tap((quickSaveId) => this.lsService.saveStringifyData(QUICK_SAVE_ID_STRING, quickSaveId))
      );
  }

  setQuickSave(program: Program): Observable<void> {
    const programObject = programObjectFromProgram(program);
    const titleUpdate = programObject.title + ' copy';
    programObject.title = titleUpdate;
    return defer(() => this.quickSaveObjectRef().set(programObject))
      .pipe(
        switchMap(() =>
          defer(() => this.quickSaveIdObjectRef().set(new ProgramId(titleUpdate, null, program.createdAt)))
        ),
        tap(() => this.lsService.removeData(QUICK_SAVE_ID_STRING) )
      )
  }

  copyProgramToUserWorkouts(uid: string, pid: string): Observable<string | null> {
    return this.getProgram(pid)
    .pipe(
      first(),
      switchMap( (program: Program) => {
        if(program){
          const programObject = programObjectFromProgram(program);
          return this.workoutService.addUserWorkout(programObject, uid)
        } else {
          return of(null);
        }
      })
    )
  }

  copyUserWorkoutToPrograms(uid: string, wid: string): Observable<string | null> {
    return this.workoutService.getWorkout(uid, wid)
    .pipe(
      first(),
      switchMap( (workout: Program) => {
        if(workout){
          const programObject = programObjectFromProgram(workout);
          const titleUpdate = programObject.title + ' copy';
          programObject.title = titleUpdate;
          return this.addProgram(programObject)
        } else {
          return of(null);
        }
      })
    )
  }

  copyQuickSaveToUserWorkouts(uid: string): Observable<string | null> {
    return this.getQuickSave()
    .pipe(
      first(),
      switchMap( (program: Program) => {
        if(program){
          const programObject = programObjectFromProgram(program);
          return this.workoutService.addUserWorkout(programObject, uid)
        } else {
          return of(null); 
        }
      })
    )
  }

  addDefaultProgramToUserWorkouts(uid: string, title: string): Observable<string | null> {
    const program = DEFAULT_PROGRAM(title);
    return this.workoutService.addUserWorkout(program, uid)
  }

}

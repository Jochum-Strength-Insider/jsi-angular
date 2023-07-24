import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Folder } from '@app/@core/models/program/folder.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { ProgramId } from '@app/@core/models/program/program-id.model';
import { DEFAULT_PROGRAM, Program } from '@app/@core/models/program/program.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { Observable, defaultIfEmpty, defer, first, forkJoin, map, mergeMap, of, switchMap, tap } from 'rxjs';

export const FOLDERS_STRING = 'folders';
export const PROGRAM_STRING = 'programs';
export const PROGRAM_IDS_STRING = 'programIds';
export const QUICK_SAVE_STRING = 'quickSave';
export const QUICK_SAVE_ID_STRING = 'quickSaveID';


@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService
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
      tap(() => this.lsService.removeData(FOLDERS_STRING))
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

  convertArrayToObject: any = (array: any[], key: string) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  saveProgramWithPhaseUpdate(pid: string, phase: Phase): Observable<void> {
    const phaseUpdate = this.mapPhaseArrayToObject(phase);
    return defer(() => this.programsInstructionObjectRef(pid).update({ [phase.title]: phaseUpdate }));
  }

  removeProgram(programId: string) : Observable<void> {
    return defer( () => this.programIdsObjectRef(programId).remove())
      .pipe(
        switchMap(() => defer( () => this.programsObjectRef(programId).remove()))
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

  updateProgramFolderAndTitle(programId: string, title: string, parentFolderId: string | null = null): Observable<void> {
    return defer( () => this.programsObjectRef(programId).update({title, parentFolderId}))
      .pipe(
        switchMap(() => {
          return defer(() => this.programIdsObjectRef(programId).update({title, parentFolderId}))
        })
      )
  }

  mapPhaseArrayToObject(phase: Phase): any {
    const daysListJSON = phase.days.reduce((accumulator, day) => {
        const { title, exercises, image } = day;
        const dayObject = {
          image,
          title,
          exercises: JSON.stringify(exercises)
        };
        return ({ ...accumulator, [day.id]: dayObject })
    }, {});
    return { ...daysListJSON }
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
      .pipe( mapKeyToObjectOperator() );
  }

  //   handleCreateWorkoutFromQuickSave = (e) => {
  //     e.preventDefault();
  //     const currentUserId = this.props.uid;
  //     this.props.firebase
  //        .quickSave()
  //        .once('value', snapshot => {
  //           const quickSaveObject = snapshot.val()
  //           if (quickSaveObject) {
  //              const programUpdate = { ...quickSaveObject, createdAt: this.timestamp };
  //              this.props.firebase
  //                 .workouts(currentUserId)
  //                 .push(programUpdate)
  //                 .then((snap) => {
  //                    const key = snap.key;
  //                    this.props.firebase.workoutIds(currentUserId)
  //                       .update({ [key]: { title: programUpdate.title, createdAt: programUpdate.createdAt, active: false } });
  //                    this.props.firebase.user(currentUserId)
  //                       .update({ programDate: programUpdate.createdAt });
  //                 })
  //           }
  //        }).catch(error => this.setState({ error }));
  //  }

  // quickSave = (e) => {
  //   e.preventDefault();

  //   const { program } = this.state;
  //   const { title } = program;
  //   const timestamp = this.props.firebase.serverValue.TIMESTAMP;

  //   const programUpdate = { ...program };
  //   const titleCopy = title + " copy";

  //   const tablesList = this.clearTracking(programUpdate);

  //   programUpdate['title'] = titleCopy;
  //   programUpdate['createdAt'] = timestamp;
  //   programUpdate['instruction'] = tablesList;

  //   this.props.firebase.quickSave().set(programUpdate)
  //      .then((snap) => {
  //         this.props.firebase.quickSaveId().set({ title: titleCopy, createdAt: timestamp });
  //         this.hideSaveModal();
  //      })
  //      .catch(error => this.setState({ error }));
  // }

  // saveToPrograms = (e) => {
  //   e.preventDefault();
  //   const { program } = this.state;
  //   const { title } = program;
  //   const timestamp = this.props.firebase.serverValue.TIMESTAMP;

  //   const programUpdate = { ...program };
  //   const titleCopy = title + " copy";

  //   const tablesList = this.clearTracking(programUpdate);

  //   programUpdate['title'] = titleCopy;
  //   programUpdate['createdAt'] = timestamp;
  //   programUpdate['instruction'] = tablesList;

  //   this.props.firebase.programs().push(programUpdate)
  //      .then((snap) => {
  //         const key = snap.key;
  //         this.props.firebase.programIds().update({ [key]: { title: titleCopy, createdAt: timestamp } });
  //         this.hideSaveModal();
  //      })
  //      .catch(error => this.setState({ error }));
  // }

}

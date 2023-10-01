import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Tasks } from '@app/@core/models/program/task.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { Observable, defer, map, of, tap } from 'rxjs';

export const TASKS_STRING = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService
  ) { }

  // // *** Tasks API ***

  private tasksListRef(): AngularFireList<Tasks> {
    return this.db.list(TASKS_STRING)
  }

  private tasksObjectRef(tid: string): AngularFireObject<Tasks> {
    return this.db.object(`${TASKS_STRING}/${tid}`)
  }
  
  getTasks(): Observable<Tasks[]> {
    const tasksRef = this.db.list(`/${TASKS_STRING}`, ref => ref.orderByChild("e"))
    return <Observable<Tasks[]>>tasksRef
      .valueChanges([], { idField: 'id' })
      .pipe(
        tap((tasks) => this.lsService.saveStringifyData(TASKS_STRING, tasks)),
        map(tasks => tasks)
      )
  }

  getTasksWithLimit(limit: number = 10, startAt: string = ''): Observable<Tasks[]> {
    const tasksRef = this.db.list(`/${TASKS_STRING}`,
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
      .pipe( tap(() => this.lsService.removeData(TASKS_STRING)) );
  }

  addTask(task: Tasks): Observable<string | null>  {
    return of(this.tasksListRef().push(task).key)
      .pipe( tap(() => this.lsService.removeData(TASKS_STRING)) );
  }

  saveTask(task: Tasks): Observable<void> {
    const { id, ...taskObject } = task;
    const updateRef = this.tasksObjectRef(id);
    return defer( () => updateRef.update({ ...taskObject }))
      .pipe( tap(() => this.lsService.removeData(TASKS_STRING)) );
  }
}

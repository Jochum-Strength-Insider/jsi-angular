import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { mapKeysToObjectArrayOperator, mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { Program } from '@app/@core/models/program/program.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  programsSub = new BehaviorSubject<Program[]>([]);
  programs$ = this.programsSub.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // // *** Program API ***

  // program = (pid) => this.db.ref(`programs/${pid}`);
  getProgram(pid: string):Observable<Program> {
    return <Observable<Program>>this.db.object(`programs/${pid}`)
    .snapshotChanges()
    .pipe( mapKeyToObjectOperator() );
  }

  // programs = () => this.db.ref('programs');
  getPrograms(): Observable<Program[]> {
  return <Observable<Program[]>>this.db.list(`programs`)
    .snapshotChanges()
    .pipe( mapKeysToObjectArrayOperator() )
  }

   // programId = (pid) => this.db.ref(`programIds/${pid}`);
   getProgramId(pid: string):Observable<Program> {
    return <Observable<Program>>this.db.object(`programIds/${pid}`)
    .snapshotChanges()
    .pipe( mapKeyToObjectOperator() );
  }
  
  // programIds = () => this.db.ref('programIds');
  getProgramIds(): Observable<Program[]> {
  return <Observable<Program[]>>this.db.list(`programIds`)
    .snapshotChanges()
    .pipe( mapKeysToObjectArrayOperator() )
  }
}

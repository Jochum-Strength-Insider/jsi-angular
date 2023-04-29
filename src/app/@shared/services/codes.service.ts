import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CodeDetails } from '@app/@core/models/codes/code-details.model';
import { Code } from '@app/@core/models/codes/code.model';
import { mapKeyToObjectOperator, mapKeysToObjectArrayOperator } from '@app/@core/utilities/mappings.utilities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodesService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // // *** Codes API ***

  // codes = () => this.db.ref('codes');
  getCodes():Observable<Code[]> {
    return <Observable<Code[]>>this.db.list(`codes`)
    .snapshotChanges()
    .pipe( mapKeysToObjectArrayOperator() );
  }
  
  // code = (cid) => this.db.ref(`codes/${cid}`);
  getCode(cid: string):Observable<Code> {
    return <Observable<Code>>this.db.object(`codes/${cid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  // // *** Code Detail API ***

  // codeDetails = () => this.db.ref('codeDetails');
  getCodeDetails():Observable<CodeDetails[]> {
    return <Observable<CodeDetails[]>>this.db.list(`codeDetails`)
    .snapshotChanges()
    .pipe( mapKeysToObjectArrayOperator() );
  }

  // codeDetail = (cid) => this.db.ref(`codeDetails/${cid}`);
  getCodeDetail(cid: string):Observable<CodeDetails> {
    return <Observable<CodeDetails>>this.db.object(`codeDetails/${cid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }
}

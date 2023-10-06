import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { CodeDetails } from '@app/@core/models/codes/code-details.model';
import { Code } from '@app/@core/models/codes/code.model';
import { Submission } from '@app/@core/models/codes/submission.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { Observable, defer, of } from 'rxjs';

export const CODES_STRING = 'codes';

@Injectable({
  providedIn: 'root'
})
export class CodesService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // // *** Codes API ***

  private codesListRef(): AngularFireList<Code> {
    return this.db.list(CODES_STRING)
  }
  
  private codesObjectRef(cid: string): AngularFireObject<Code> {
    return this.db.object(`${CODES_STRING}/${cid}`)
  }

  getCodes():Observable<Code[]> {
    return this.codesListRef()
      .valueChanges([], { idField: 'id' })
  }

  getActiveCodes():Observable<Code[]> {
    const activeCodesRef = this.db.list(
      `${CODES_STRING}`,
      ref => ref.orderByChild("active").equalTo(true)
    );

    return <Observable<Code[]>>activeCodesRef
      .valueChanges([], { idField: 'id' });
  }

  getCodesByDiscountCode(discountCode: string): Observable<Code[]> {
    const codesByPromoRef = this.db.list(
      `${CODES_STRING}`,
      ref => ref.orderByChild('distountCode').equalTo(discountCode)
    );

    return <Observable<Code[]>>codesByPromoRef
      .valueChanges([], { idField: 'id' });
  }
  
  getCode(cid: string):Observable<Code> {
    return this.codesObjectRef(`codes/${cid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  toggleCodeIsActive(code: Code) : Observable<void> {
    return defer( () => this.codesObjectRef(code.id).update({active: !code.active }))
  }

  removeCode(code: Code) : Observable<void> {
    return defer( () => this.codesObjectRef(code.id).remove())
  }

  addCode(code: Code): Observable<string | null>  {
    return of(this.codesListRef().push(code).key)
  }

  saveCode(code: Code): Observable<void> {
    const { id, ...codeObject } = code;
    const updateRef = this.codesObjectRef(id);
    return defer( () => updateRef.update({ ...codeObject }));
  }

  // // *** Code Detail API ***
  
  private codeDetailsObjectRef(cid: string): AngularFireObject<CodeDetails> {
    return this.db.object(`codeDetails/${cid}`)
  }
  
  private codeDetailsSubmissionsListRef(cid: string): AngularFireList<Submission> {
    return this.db.list(`codeDetails/${cid}/submissions`)
  }
  
  getCodeDetails(code: Code): Observable<CodeDetails> {
    return this.codeDetailsObjectRef(code.id)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getCodeDetailsSubmissions(code: Code): Observable<Submission[]> {
    return this.codeDetailsSubmissionsListRef(code.id)
      .valueChanges([], { idField: 'id' })
    }

  addCodeDetailsSubmission(code: Code, submission: Submission): Observable<string | null> {
    return of(this.codeDetailsSubmissionsListRef(code.id).push(submission).key);
  }
}

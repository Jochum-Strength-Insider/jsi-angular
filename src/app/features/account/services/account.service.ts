import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { Observable, defer, last, switchMap, tap } from 'rxjs';

export const BEFORE_STRING = 'beforeUrl';
export const AFTER_STRING = 'afterUrl';

// https://www.bezkoder.com/angular-15-firebase-storage/
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private storage: AngularFireStorage,
    private lsService: LocalStorageService
  ) { }

  private userBeforeRef(uid: string): AngularFireStorageReference {
    return this.storage.ref(`images/${uid}/before`)
  }

  private userAfterRef(uid: string): AngularFireStorageReference {
    return this.storage.ref(`images/${uid}/after`)
  }

  getUserBefore(uid: string): Observable<any> {
    return this.userBeforeRef(uid).getDownloadURL()
      .pipe(tap((url) => this.lsService.saveData(BEFORE_STRING, url)));
  }
  
  getUserAfter(uid: string): Observable<any> {
    return this.userAfterRef(uid).getDownloadURL()
      .pipe(tap((url) => this.lsService.saveData(AFTER_STRING, url)));
  }
  
  uploadBefore(uid: string, file: File): Observable<any> {
    const path = `images/${uid}/before`
    const uploadTask = this.storage.upload(path, file);
    return uploadTask.snapshotChanges()
      .pipe(
        last(),
        switchMap( () => this.getUserBefore(uid) )
      )
  }

  uploadAfter(uid: string, file: File): Observable<any> {
    const path = `images/${uid}/after`
    const uploadTask = this.storage.upload(path, file);
    return uploadTask.snapshotChanges()
      .pipe(
        last(),
        switchMap( () => this.getUserAfter(uid) )
      )
  }

  deleteUserBefore(uid: string): Observable<void> {
    const ref = this.userBeforeRef(uid);
    return this.deleteFile(ref).pipe(
      tap(() => this.lsService.removeData(BEFORE_STRING))
    );
  }

  deleteUserAfter(uid: string): Observable<void> {
    const ref = this.userAfterRef(uid);
    return this.deleteFile(ref).pipe(
      tap(() => this.lsService.removeData(AFTER_STRING))
    );
  }

  private deleteFile(ref: AngularFireStorageReference): Observable<void> {
    return defer(() => ref.delete());
  }
}

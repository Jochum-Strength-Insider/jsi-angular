import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ListResult } from '@angular/fire/compat/storage/interfaces';
import { finalize, Observable, tap } from 'rxjs';

interface FileUpload {
  key: string;
  url: string;
  name: string;
  file: {
    name: string;
  };
}

// https://www.bezkoder.com/angular-15-firebase-storage/
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  basePath = 'images';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

    // userImages = (uid) => this.storage.ref(`images/${uid}`);
    getUserImages(uid: string): Observable<ListResult | null> {
      const storageRef = this.storage.ref(`images/${uid}`);
      return storageRef.listAll()
    }
  
    // userBefore = (uid) => this.storage.ref(`images/${uid}/before`);
    getUserBefore(uid: string): Observable<any> {
      const storageRef = this.storage.ref(`images/${uid}/before`);
      return storageRef.getDownloadURL();
    }
    
    // userAfter = (uid) => this.storage.ref(`images/${uid}/after`);
    getUserAfter(uid: string): Observable<any> {
      const storageRef = this.storage.ref(`images/${uid}/after`);
      return storageRef.getDownloadURL();
    }
    
    pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
      const filePath = `${this.basePath}/${fileUpload.file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload);
          });
        })
      ).subscribe();
  
      return uploadTask.percentageChanges();
    }

    private saveFileData(fileUpload: FileUpload): void {
      this.db.list(this.basePath).push(fileUpload);
    }
  
    getFiles(numberItems: number): AngularFireList<FileUpload> {
      return this.db.list(this.basePath, ref =>
        ref.limitToLast(numberItems));
    }
  
    deleteFile(fileUpload: FileUpload): void {
      this.deleteFileDatabase(fileUpload.key)
        .then(() => {
          this.deleteFileStorage(fileUpload.name);
        })
        .catch(error => console.log(error));
    }
  
    private deleteFileDatabase(key: string): Promise<void> {
      return this.db.list(this.basePath).remove(key);
    }
  
    private deleteFileStorage(name: string): void {
      const storageRef = this.storage.ref(this.basePath);
      storageRef.child(name).delete();
    }

    private uploadFile(event: any) {
      const file = event.target.files[0];
      const filePath = 'name-your-file-path-here';
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
          finalize(() => fileRef.getDownloadURL() )
       )
      .subscribe()
    }
}

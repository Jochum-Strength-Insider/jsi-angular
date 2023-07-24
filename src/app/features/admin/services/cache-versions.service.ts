import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { Observable, first, map } from 'rxjs';

// NOTES: This almost works. I'd have to turn the angular fetch into a cold observable then refetch the values on any update action.
// While it seems like the tasks are a heavy they only use up 100k so this probably isn't as necessary as it appears.

const CACHE_VERSION_STRING = 'cacheVersion';

@Injectable({
  providedIn: 'root'
})
export class CacheVersionService {

  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService
  ) { }

    // // *** CacheVersion API ***

    private cacheVersionListRef(): AngularFireList<number> {
      return this.db.list(CACHE_VERSION_STRING)
    }

    private cacheVersionObjectRef(name: string): AngularFireObject<number> {
      return this.db.object(`${CACHE_VERSION_STRING}/${name}`)
    }

    getVersionsList(): Observable<number[]> {
      return this.cacheVersionListRef()
        .valueChanges()
        .pipe(first())
    }

    getVersionNumber(name: string) : Observable<number> {
      return this.cacheVersionObjectRef(name)
        .valueChanges()
        .pipe(
          first(),
          map( version => version === null ? 0 : version)
        )
    }
    
    private createTimeStamp(): number {
      return new Date().getTime();
    }

    // public updateVersion(name: string): Observable<number> {
    //   console.log('updateVersion', name);
    //   const versionKey = this.lsService.getVersionKey(name);
    //   const timestamp = this.createTimeStamp();
    //   return defer(() => this.cacheVersionObjectRef(name).set(timestamp))
    //     .pipe(
    //       map(() => timestamp),
    //       tap((timestamp) => {
    //         localStorage.setItem(versionKey, `${timestamp}`);
    //         console.log('updateVersion', versionKey, timestamp);
    //       })
    //     )
    // }
  }
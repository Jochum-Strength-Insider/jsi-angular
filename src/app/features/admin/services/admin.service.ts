import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '@app/@core/models/auth/user.model';
import { CodeDetails } from '@app/@core/models/codes/code-details.model';
import { Code } from '@app/@core/models/codes/code.model';
import { Message } from '@app/@core/models/messages/message.model';
import { Folder } from '@app/@core/models/program/folder.model';
import { Tasks } from '@app/@core/models/program/task.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { mapKeysToObjectArrayOperator, mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { MessageService } from '@app/features/messages/services/message.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private db: AngularFireDatabase,
    private messageService: MessageService
  ) { }

  // *** Admin Unread API ***

  adminUnreadMessagesRef(): AngularFireList<Message> {
    return this.db.list('adminUnread');
  }

  adminUnreadMessageRef(mid: string): AngularFireObject<Message> {
    return this.db.object(`adminUnread/${mid}`);
  }

  // const messageObject = {
  //   text,
  //   userId: authUser.uid,
  //   username: authUser.username,
  //   createdAt: Number(moment().format("x")),
  // };

  // this.props.firebase.messages(this.props.roomId).push(messageObject)
  //   .then((snap) => {
  //     if (this.state.currentlyMessaging !== this.props.roomId) {
  //       const key = snap.key;
  //       this.props.firebase.adminUnreadMessages().update({ [key]: messageObject });
  //     }
  //   })

  addUnreadMessage(text: string, authUser: User, currentlyMessaging: string, roomId: string) {
    const messageObject = {
      text: text,
      userId: authUser.id,
      username: authUser.username,
      createdAt: new Date().valueOf(),
    };

    this.messageService.addMessage(messageObject)
      .subscribe((snap: any) => {
        if (currentlyMessaging !== roomId) {
          const key = snap.key;
          this.adminUnreadMessageRef(key).update(messageObject);
        }
      })
  }

  // adminUnreadMessages = () => this.db.ref(`adminUnread`);
  getAdminUnreadMessages(): Observable<Message[]> {
    return <Observable<Message[]>>this.adminUnreadMessagesRef()
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  // adminUnreadMessage = mid => this.db.ref(`adminUnread/${mid}`);
  getAdminUnreadMessage(mid: string): Observable<Message> {
    return <Observable<Message>>this.adminUnreadMessageRef(mid)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() )
  }

  clearAdminUnread(): Observable<void>{
    return from(this.adminUnreadMessagesRef().remove());
  }

  // currentlyMessaging = () => this.db.ref(`currentlyMessaging`);
  getCurrentlyMessaging(): Observable<string> {
    return <Observable<string>>this.db.object(`currentlyMessaging`)
      .valueChanges()
  }

  // // *** User Unread API ***

  // unreadMessages = uid => this.db.ref(`unread/${uid}`);
  getUnreadMessages(uid: string): Observable<Message[]> {
    return <Observable<Message[]>>this.db.list(`unread/${uid}`)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  // // *** WorkoutIds API ***

  // workoutIds = uid => this.db.ref(`workoutids/${uid}`);
  getWorkoutIds(uid: string):Observable<Workout[]> {
    return <Observable<Workout[]>>this.db.list(`workoutids/${uid}`)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  // workoutId = (uid, wid) => this.db.ref(`workoutids/${uid}/${wid}`);
  getWorkoutId(uid: string, wid: string):Observable<Workout> {
    return <Observable<Workout>>this.db.object(`workoutids/${uid}/${wid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  // // *** Workout API ***

  // workouts = (uid) => this.db.ref(`workouts/${uid}`);
  getWorkouts(uid: string):Observable<Workout[]> {
    return <Observable<Workout[]>>this.db.list(`workouts/${uid}`)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  // workout = (uid, wid) => this.db.ref(`workouts/${uid}/${wid}`);
  getWorkout(uid: string, wid: string):Observable<Workout> {
    return <Observable<Workout>>this.db.list(`workouts/${uid}/${wid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  // // *** quickSave API ***

  // quickSave = () => this.db.ref('quickSave');
  getQuickSave():Observable<Workout> {
    return <Observable<Workout>>this.db.object(`quickSave`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  // quickSaveId = () => this.db.ref('quickSaveId');
  getQuickSaveId():Observable<string> {
    return <Observable<string>>this.db.object(`quickSaveId`)
      .valueChanges()
  }

  // // *** Folders API ***

  // folders = () => this.db.ref('folders');
  getFolders():Observable<Folder[]> {
    return <Observable<Folder[]>>this.db.list(`folders`)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  // folder = (fid) => this.db.ref(`folders/${fid}`);
  getFolder(fid: string):Observable<Folder> {
    return <Observable<Folder>>this.db.list(`folders/${fid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  // // *** Task API ***

  // tasks = () => this.db.ref('tasks');
  getTasks():Observable<Tasks[]> {
    return <Observable<Tasks[]>>this.db.list(`tasks`)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  // task = (tid) => this.db.ref(`tasks/${tid}`);
  getTask(tid: string):Observable<Tasks> {
    return <Observable<Tasks>>this.db.object(`tasks/${tid}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

}

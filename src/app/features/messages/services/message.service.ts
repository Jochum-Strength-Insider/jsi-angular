import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Message } from '@app/@core/models/messages/message.model';
import { mapKeysToObjectArrayOperator, mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messagesSub = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSub.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) { }

    // *** Message API ***

    userMessagesRef(uid: string): AngularFireList<Message> {
      return this.db.list(`messages/${uid}`);
    }
  
    userMessageRef(uid: string, mid: string): AngularFireObject<Message> {
      return this.db.object(`messages/${uid}/${mid}`);
    }

    // message = (uid, mid) => this.db.ref(`messages/${uid}/${mid}`);
   getUserMessage(uid: string, mid: string):Observable<Message> {
    return <Observable<Message>>this.userMessageRef(uid, mid)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  // messages = uid => this.db.ref(`messages/${uid}`);
  getUserMessages(uid: string): Observable<Message[]> {
    return <Observable<Message[]>>this.userMessagesRef(uid)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() )
  }

  addMessage(message: Message): Observable<any> {
    return from(this.userMessagesRef(message.userId).push(message))
  }

}

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Message } from '@app/@core/models/messages/message.model';
import { BehaviorSubject, Observable, defer, first, map, of } from 'rxjs';

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

  userMessagesListRef(uid: string): AngularFireList<Message> {
    return this.db.list(`messages/${uid}`);
  }

  userMessageObjectRef(uid: string, mid: string): AngularFireObject<Message> {
    return this.db.object(`messages/${uid}/${mid}`);
  }

  getUserMessage(uid: string, mid: string):Observable<Message> {
    return <Observable<Message>>this.userMessageObjectRef(uid, mid)
    .valueChanges();
  }

  getUserMessages(uid: string): Observable<Message[]> {
    return <Observable<Message[]>>this.userMessagesListRef(uid)
    .valueChanges([], { idField: 'id' })
  }

  getUserMessagesWithLimit(uid: string, limit: number):Observable<Message[]> {
    const messageRef = this.db.list(
      `messages/${uid}`,
      ref => ref.orderByChild("createdAt").limitToLast(limit)
    )

    return <Observable<Message[]>>messageRef
      .valueChanges([], { idField: 'id' })
  }

  getFirstUserMessage(uid: string): Observable<Message | null>  {
    const messageRef = this.db.list(
      `messages/${uid}`,
      ref => ref.orderByChild("createdAt").limitToFirst(1)
    )

    return <Observable<Message | null>>messageRef
      .valueChanges([], { idField: 'id' })
      .pipe(
        first(),
        map(messages => messages.length > 0 ? messages[0] : null)
      )
  }

  addUserMessage(uid: string, message: Message): Observable<string | null> {
    return of(this.userMessagesListRef(uid).push(message).key);
  }

  removeUserMessage(uid: string, message: Message): Observable<any> {
    return defer( () => this.userMessageObjectRef(uid, message.id).remove());
  }

  public removeUserMessages(uid: string): Observable<void> {
    return defer( () => this.userMessagesListRef(uid).remove())
  }

  // *** AdminUnreadMessage API ***

  adminUnreadListRef(): AngularFireList<Message> {
    return this.db.list(`adminUnread`);
  }

  adminUnreadObjectRef(mid: string): AngularFireObject<Message> {
    return this.db.object(`adminUnread/${mid}`);
  }

  addAdminUnreadMessage(mid: string, message: Message): Observable<any> {
    return defer( () => this.adminUnreadListRef().update(mid, message))
  }

  getAdminUnreadMessages(): Observable<Message[]> {
    return this.adminUnreadListRef()
      .valueChanges([], { idField: 'id' })
  }

  removeAdminUnreadMessage(mid: string): Observable<void> {
    return defer(() => this.adminUnreadObjectRef(mid).remove())
  }

  clearAllAdminUnreadMessages(): Observable<void> {
    return defer(() => this.adminUnreadListRef().remove())
  }

  // *** CurrentlyMessaging API ***

  currentlyMessagingObjectRef(): AngularFireObject<{uid: string}> {
    return this.db.object(`currentlyMessaging`);
  }

  setCurrentlyMessaging(uid: string): Observable<any> {
    return defer( () => this.currentlyMessagingObjectRef().update({ uid }));
  }

  clearCurrentlyMessaging(): Observable<any> {
    return defer( () => this.currentlyMessagingObjectRef().remove());
  }

  getCurrentlyMessaging(): Observable<string | undefined> {
    return <Observable<string>>this.currentlyMessagingObjectRef()
      .valueChanges().pipe(map(messaging => messaging?.uid));
  }
}

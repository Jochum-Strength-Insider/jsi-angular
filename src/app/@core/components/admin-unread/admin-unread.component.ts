import { Component } from '@angular/core';
import { Message } from '@app/@core/models/messages/message.model';
import { FromNowPipe } from '@app/@core/pipes/from-now.pipe';
import { UserService } from '@app/features/admin/services/user.service';
import { MessageService } from '@app/@shared/services/message.service';
import { Observable, catchError, map, of, take } from 'rxjs';

@Component({
  selector: 'app-admin-unread',
  templateUrl: './admin-unread.component.html',
  styleUrls: ['./admin-unread.component.css'],
  providers: [
    FromNowPipe
  ]
})
export class AdminUnreadComponent {
  unread$: Observable<Message[]> = of([]);
  error: Error;

  constructor(
    private messagesService: MessageService,
    private userService: UserService
    ) { }

  ngOnInit(){
    this.unread$ = this.messagesService
      .getAdminUnreadMessages()
      .pipe(
        map(messages => messages.reverse()),
        catchError(() => of([]))
      );
  }

  clearUnread(){
    this.messagesService
      .clearAllAdminUnreadMessages()
      .subscribe({
        next: () => console.log('messages cleared'),
        error: (err) => this.error = err
      })
  }

  handleClose(message: Message){
    this.messagesService
      .removeAdminUnreadMessage(message.id)
      .subscribe({
        error: (err) => this.error = err
      })
  }

  setSelectedUser(userId: string){
    this.userService
      .getUserById(userId)
      .pipe(take(1))
      .subscribe({
        next: (user) => this.userService.setSelectedUser(user),
        error: (err) => this.error = err
      })
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { MessageService } from '@app/@shared/services/message.service';
import { Subscription, catchError, interval, mergeMap, of, startWith, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = true;
  authUserSub: Subscription;
  authUser: User | null;
  messages: Message[] = [];

  constructor(
    private authService : AuthService,
    private messagesService: MessageService
  ) { }

  ngOnInit(): void {
    this.authUserSub = this.authService.currentUser$
      .pipe(
        tap((user) => this.authUser = user),
        switchMap((user) => {
        if(user){
          return interval(6000)
            .pipe(
              startWith(0),
              mergeMap(() => this.messagesService.getUserUnreadMessages(user.id).pipe(take(1)))
            )
        } else {
          return of([]);
        }
        }),
        catchError(() => of([]))
      )
      .subscribe({
        next: (messages) => this.messages = messages
      })
  }

  ngOnDestroy(): void {
    this.authUserSub?.unsubscribe();
  }

  onSelect = () => this.collapsed = true;
  onToggle = () => this.collapsed = !this.collapsed;
}

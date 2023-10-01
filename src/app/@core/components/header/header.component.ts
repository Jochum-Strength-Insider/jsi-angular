import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { MessageService } from '@app/@shared/services/message.service';
import { Subscription, of, switchMap, tap } from 'rxjs';

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
          return this.messagesService.getUserUnreadMessages(user.id)
        } else {
          return of([]);
        }
      }))
      .subscribe({
        next: (messages) => this.messages = messages,
        error: (err) => console.log(err)
      })
  }

  ngOnDestroy(): void {
    this.authUserSub?.unsubscribe();
  }

  onSelect = () => this.collapsed = true;
  onToggle = () => this.collapsed = !this.collapsed;
}

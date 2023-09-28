import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { UserService } from '@app/features/admin/services/user.service';
import { BehaviorSubject, Subject, Subscription, map, of, switchMap } from 'rxjs';
import { MessageService } from '../../services/message.service';


/*
 Fix scroll behavior
 Fix weird disappearing page bug
*/


@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() user: User;
  @Input() adminUser: User | null = null;

  @ViewChild('scrollContain') scrollContain: ElementRef;
  @ViewChild('scrollBottom') scrollBottom: ElementRef;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // Clear currentlyMessaging on window unload
    this.ngOnDestroy();
  }

  limit: number = 15;
  limit$ = new BehaviorSubject<number>(this.limit);

  messages: Message[] = [];
  messageDates: number[] = [];

  messagesSub: Subscription;
  currentlyMessagingSub: Subscription;
  messagesLoadedSubject = new Subject<boolean>();
  initialLoad: boolean = true;
  scrollSubscription: Subscription;
  scrollDelay: number = 0;

  currentlyMessaging: boolean = false;
  error: Error | null;

  scroll: boolean = true;

  firstDate: number;
  firstDateNotIncluded: boolean = false;
  enoughMessages: boolean = false;

  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    console.log('Messages Container onInit', this.user);
    if(this.adminUser) {
      // Delay to keep scroll in sync with admin tabs animation
      this.scrollDelay = 150;
      this.setAdminCurrentlyMessaging();
      this.listenForUserCurrentlyMessaging();
    } else {
      this.listenForMessages();
      this.setUserCurrentlyMessaging();
      this.listenForAdminCurrentlyMessaging();
      this.clearUserUnreadMessages();
    }
  }

  ngAfterViewInit(): void {
    this.scrollSubscription = this.messagesLoadedSubject
      .subscribe(() => {
        if(this.scroll){
          setTimeout(() => {
            this.scrollToBottom(!this.initialLoad);
            this.initialLoad = false;
            this.scrollDelay = 0;
          }, this.scrollDelay)
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.adminUser){
      ifPropChanged(changes['user'], () => {
       this.listenToNewUserMessages()
      });
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if(this.adminUser){
      this.messageService
        .clearAdminCurrentlyMessaging()
        .subscribe();
    } else {
      this.messageService
        .removeUserCurrentlyMessaging(this.user.id)
        .subscribe();
    }
    this.messagesSub?.unsubscribe();
    this.scrollSubscription?.unsubscribe();
    this.currentlyMessagingSub?.unsubscribe();
  }

  listenForMessages() {
    this.loading = true;
    this.messagesSub?.unsubscribe();
    this.messagesSub = this.limit$
      .pipe(
        switchMap((limit) => this.messageService.getUserMessagesWithLimit(this.user.id, limit))
      )
      .subscribe({
        next: messages => {
          if(messages.length > 0){
            this.messages = messages;
            this.messagesLoadedSubject.next(true);
            this.messageDates = messages.map(item => item.createdAt)
            this.firstDateNotIncluded = this.messageDates.indexOf(this.firstDate) === -1 ? true : false;
            this.enoughMessages = messages.length === this.limit ? true : false;
          } else {
            this.enoughMessages = false;
            this.messages = [];
          }
          this.loading = false;
        },
        error: (err: Error) => {
          this.error = err;
          this.loading = false;
        }
      });
  }

  listenToNewUserMessages(){
    console.log('listenToNewUserMessages', this.user);
    this.setLimit(15);
    this.messages = [];
    this.enoughMessages = false;
    this.initialLoad = true;

    this.setAdminCurrentlyMessaging();
    this.listenForUserCurrentlyMessaging();
    this.listenForMessages();
  }

  listenForUserCurrentlyMessaging(){
    this.currentlyMessagingSub?.unsubscribe();
    this.currentlyMessagingSub = this.messageService.getUserCurrentlyMessaging(this.user.id)
    .subscribe((messaging) => {
      this.currentlyMessaging = messaging;
    });
  }

  listenForAdminCurrentlyMessaging(){
    this.currentlyMessagingSub?.unsubscribe();
    this.currentlyMessagingSub = this.messageService.getAdminCurrentlyMessaging()
        .subscribe((id) => {
          this.currentlyMessaging = id === this.user.id
        });
  }

  setAdminCurrentlyMessaging(){
    this.messageService.setAdminCurrentlyMessaging(this.user.id)
    .subscribe();
  }

  setUserCurrentlyMessaging(){
    this.messageService.addUserCurrentlyMessaging(this.user.id)
      .subscribe();
  }

  clearUserUnreadMessages() {
    this.userService.clearUserUnreadMessage(this.user.id)
      .subscribe({
        next: () => console.log('unread messages cleared'),
        error: (err) => console.log(err)
      })
  }

  scrollToBottom(smooth: boolean = true): void {
    const options = smooth ? { behavior: 'smooth' } : {};
    this.scrollBottom?.nativeElement.scrollIntoView(options);
  }

  handleSendMessage(message: string) {
    console.log('handleSendMessage')
    if(message.trim().length > 0) {
      const messageObject = this.adminUser
      ? new Message(message, this.adminUser.id, this.adminUser.username)
      : new Message(message, this.user.id, this.user.username);

      this.messageService.addUserMessage(this.user.id, messageObject)
      .pipe(
        switchMap((key) => {
          if( key && (this.adminUser && !this.currentlyMessaging) ) {
            return this.userService.addUserUnreadMessage(this.user.id, key, messageObject)
              .pipe(map(() => key))
          } else if( key && (!this.adminUser && !this.currentlyMessaging) )
            return this.messageService.addAdminUnreadMessage(messageObject, key)
              .pipe(map(() => key))
          else {
            return of(key)
          }
        }),
      )
      .subscribe({
        error: (err: Error) => this.error = err
      })
    }
  }

  loadMore() {
    if (this.firstDate !== undefined) {
      this.messageService.getFirstUserMessage(this.user.id)
      .subscribe({
        next: (message) => {
          if (message) {
            this.firstDate = message.createdAt;
            this.setLimit(this.limit + 15);
            this.scroll = false;
          }
        },
        error: (err: Error) => {
          this.error = err
        }
      })
    } else {
      this.setLimit(this.limit + 15);
      this.scroll = false;
    }
  }

  private setLimit(limit: number) {
    this.limit = limit;
    this.limit$.next(limit);
  }
}

import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { BehaviorSubject, Subject, Subscription, catchError, finalize, map, of, switchMap } from 'rxjs';
import { MessageService } from '@shared/services/message.service';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';


@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() user: User;

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
    private errorService: ErrorHandlingService
  ){}

  ngOnInit(): void {
    this.listenForMessages();
    this.setUserCurrentlyMessaging();
    this.listenForAdminCurrentlyMessaging();
    this.clearUserUnreadMessages();
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

  ngOnDestroy(): void {
    this.messageService
      .removeUserCurrentlyMessaging(this.user.id)
      .subscribe();
    this.messagesSub?.unsubscribe();
    this.scrollSubscription?.unsubscribe();
    this.currentlyMessagingSub?.unsubscribe();
  }

  listenForMessages() {
    this.loading = true;
    this.messagesSub?.unsubscribe();
    this.messagesSub = this.limit$
      .pipe(
        switchMap((limit) => {
          return this.messageService.getUserMessagesWithLimit(this.user.id, limit)
        }),
        finalize(() => this.loading = false)
      )
    .subscribe({
      next: messages => {
        if(messages.length > 0) {
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
      error: (err) => {
        this.errorService.generateError(
          err,
          'Get User Messages',
          'An error occurred getting your messages. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
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
      .pipe(catchError(() => of('')))
      .subscribe();
  }

  setUserCurrentlyMessaging(){
    this.messageService.addUserCurrentlyMessaging(this.user.id)
      .pipe(catchError(() => of('')))
      .subscribe();
  }

  clearUserUnreadMessages() {
    this.messageService.clearUserUnreadMessage(this.user.id)
      .pipe(catchError(() => of('')))
      .subscribe()
  }

  scrollToBottom(smooth: boolean = true): void {
    const options = smooth ? { behavior: 'smooth' } : {};
    this.scrollBottom?.nativeElement.scrollIntoView(options);
  }

  handleSendMessage(message: string) {
    if(message.trim().length > 0) {
      const messageObject = new Message(message, this.user.id, this.user.username);
      this.messageService.addUserMessage(this.user.id, messageObject)
      .pipe(
        switchMap((key) => {
          if( key && (!this.currentlyMessaging) ) {
            return this.messageService.addAdminUnreadMessage(messageObject, key)
              .pipe(map(() => key))
          } else {
            return of(key)
          }
        })
      )
      .subscribe({
        error: (err) => {
          this.errorService.generateError(
            err,
            'Send Message',
            'An error occurred sending your messages. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
          );
        }
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
        error: (err) => {
          this.errorService.generateError(
            err,
            'Get More Messages',
            'An error occurred loading more messages. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
          );
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

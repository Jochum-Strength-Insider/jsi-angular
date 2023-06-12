import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '@app/@core/models/messages/message.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { BehaviorSubject, Subject, Subscription, delay, map, of, switchMap } from 'rxjs';
import { MessageService } from '../../services/message.service';

/* 
TODO:
- Will need to test admin logic for sending
*/ 

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.css']
})
export class MessagesContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() uid : string;
  @Input() username : string;
  @Input() isAdmin: boolean = false;
  @Input() adminId: string;

  @ViewChild('scrollContain') scrollContain: ElementRef;
  @ViewChild('scrollBottom') scrollBottom: ElementRef;

  limit: number = 15;
  limit$ = new BehaviorSubject<number>(this.limit);

  messages: Message[] = [];
  messageDates: number[] = [];

  messageSubject = new Subject<Message[]>();

  messagesSub: Subscription;
  currentlyMessagingSub: Subscription;
  scrollSub: Subscription;

  currentlyMessaging: boolean = false;
  error: Error | null;

  scroll: boolean = true;
  firstDate: number;
  firstDateNotIncluded: boolean = false;
  enoughMessages: boolean = false;

  loading: boolean = false;
  initialLoad: boolean = true;

  constructor(
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.listenForMessages();
    if(this.isAdmin) {
      this.setCurrentlyMessaging();
    } else {
      this.currentlyMessagingSub = this.messageService.getCurrentlyMessaging()
        .subscribe((id) => this.currentlyMessaging = id ? id === this.uid : false)
    }
  }

  ngAfterViewInit(): void {
    // Using delay(0) is the same as setTimeout() in this case
    this.scrollSub = this.messageSubject.pipe(delay(0)).subscribe(() => {
      if(this.scroll && !this.currentlyMessaging){
        this.scrollToBottom(!this.initialLoad);
      }
      this.initialLoad = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.isAdmin){
      ifPropChanged(changes['uid'], () => this.setCurrentlyMessaging() )
    }
  }

  ngOnDestroy(): void {
    this.messagesSub?.unsubscribe();
    this.scrollSub?.unsubscribe();
    this.currentlyMessagingSub?.unsubscribe();
  }

  listenForMessages() {      
    this.loading = true;
    this.messagesSub = this.limit$
      .pipe(
        switchMap((limit) => this.messageService.getUserMessagesWithLimit(this.uid, limit))
      )
      .subscribe({
        next: messages => {
          console.log('listenForMessages');
          if(messages.length > 0){
            this.messages = messages;
            this.messageSubject.next(messages);
            this.messageDates = messages.map(item => item.createdAt)
            this.firstDateNotIncluded = this.messageDates.indexOf(this.firstDate) === -1 ? true : false;
            this.enoughMessages = messages.length === this.limit ? true : false;
          } else {
            this.messages = [];
          }
          this.loading = false;
        },
        error: err => this.error = err
      });
  }

  setCurrentlyMessaging(){
    this.messageService.setCurrentlyMessaging(this.uid)
      .subscribe({
        next: () => {
          console.log('currentlyMessaging Set');
        },
        error: (err: Error) => {
          this.error = err
        }
      });
  }

  scrollToBottom(smooth: boolean = true): void {
    const options = smooth ? { behavior: 'smooth' } : {};
    this.scrollBottom?.nativeElement.scrollIntoView(options);
  }

  handleSendMessage(message: string) {
    if(message.trim().length > 0){
      const messageObject = (this.isAdmin && this.adminId)
      ? new Message(message, this.adminId, this.username)
      : new Message(message, this.uid, this.username);

      console.log('handleSendMessage', messageObject);

      this.messageService.addUserMessage(this.uid, messageObject)
      .pipe(
        switchMap((key) => {
          if(key && (!this.isAdmin && !this.currentlyMessaging)){
            return this.messageService.addAdminUnreadMessage(key, messageObject)
              .pipe(map(() => key))
          } else {
            return of(key)
          }
        }))
      .subscribe({
        next: (key) => {
          console.log('sendMessage', key);
        },
        error: (err: Error) => {
          this.error = err
        }
      })
    }
  }

  loadMore() {
    if (this.firstDate !== undefined) {
      this.messageService.getFirtUserMessage(this.uid)
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

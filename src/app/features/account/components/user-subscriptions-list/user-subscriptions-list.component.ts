import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserSubscription } from '@app/@core/models/auth/user-subscription.model';
import { User } from '@app/@core/models/auth/user.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-subscriptions-list',
  templateUrl: './user-subscriptions-list.component.html',
  styleUrls: ['./user-subscriptions-list.component.css']
})
export class UserSubscriptionsListComponent implements OnChanges {
  @Input() user: User;
  @Input() cancelled: boolean = false;
  @Input() subscriptions: UserSubscription[] = [];
  @Input() subscribeText: string = "Resubscribe";
  @Output() cancelClicked = new EventEmitter<UserSubscription>();
  @Output() subscribeClicked = new EventEmitter();
  selectedSubscription: UserSubscription | null = null;
  noActiveSubs: boolean = false;

  constructor(private modalService: NgbModal){ }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['subscriptions'], (subscriptions: UserSubscription[]) => {
      this.noActiveSubs = !subscriptions.some((sub) => sub.active);
    })
  }

  handleOpenModal(content: any, subscription: UserSubscription){
    this.selectedSubscription = subscription;
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  cancelAccount(){
    if(this.selectedSubscription){
      this.cancelClicked.emit(this.selectedSubscription);
    }
  }

  subscribe(){
    this.subscribeClicked.emit();
  }
}

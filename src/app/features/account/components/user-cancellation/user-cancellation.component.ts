import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* 
TODO:
Cancellation Button
Cancellation how to
Are you sure? modal

Send admin message on user cancellation

Link to cancel paypal subscription
https://www.paypal.com/myaccount/autopay/connect/{billingId}
*/

@Component({
  selector: 'app-user-cancellation',
  templateUrl: './user-cancellation.component.html',
  styleUrls: ['./user-cancellation.component.css']
})
export class UserCancellationComponent {
  @Input() user: User;
  @Input() cancelled: boolean = false;
  @Output() cancelClicked = new EventEmitter();

  constructor(private modalService: NgbModal){ }

  handleOpenModal(content: any){
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  cancelAccount(){
    this.cancelClicked.emit();
  }
}

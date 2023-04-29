import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Code } from '@app/@core/models/codes/code.model';
import { IPayPalConfig } from 'ngx-paypal';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnChanges {

  @Output() stepSubmit = new EventEmitter();
  @Input() email: string = '';
  @Input() username: string = '';
  @Input() appliedCode: Code;
  @Input() referral: string;

  public payPalConfig?: IPayPalConfig;

  constructor() {}

  ngOnInit(): void {
      this.initConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['appliedCode']?.currentValue){
      this.initConfig();
    }
  }


  private initConfig(): void {
    console.log('initConfig');
    this.payPalConfig = {
      clientId: 'Adbfuon92JCZrJgEfTOK6QKkKVRLLJMQE7LTuB-jAUSkuP27i-s9DI3_XVUsZALqy8HmrEA2bjYRLVjh',
      style: {
        color: 'white',
        label: 'subscribe',
        layout: 'horizontal',
        shape: 'pill',
        tagline: false,
      },
      fundingSource: 'PAYPAL',
      vault: 'true',
      intent: 'subscription',
      createSubscriptionOnClient: (data: any) => ({
        plan_id: this.appliedCode.subscriptionId,
        quantity: this.appliedCode.price,
        custom_id: ''
      }),
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      }
    };
  }
}


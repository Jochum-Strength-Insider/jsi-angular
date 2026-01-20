import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { environment } from '@env/environment';
import { ICreateSubscriptionRequest, IOnApproveCallbackData, IPayPalConfig } from 'ngx-paypal';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnChanges {
  @Output() stepSubmit = new EventEmitter<IOnApproveCallbackData>();
  @Input() subscriptionId: string = "";
  payPalConfig?: IPayPalConfig;

  constructor(private errorService: ErrorHandlingService) {}

  ngOnInit(): void {
    this.initConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['subscriptionId'], (_, firstChange) => {
      if(!firstChange){
        this.payPalConfig = undefined;
        setTimeout(() => {
          this.initConfig();
        },200)
      }
    })
  }

  private initConfig(): void {
    this.payPalConfig = {
      clientId: environment.paypalId || "",
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
      createSubscriptionOnClient: (data: any) => <ICreateSubscriptionRequest>{
        plan_id: this.subscriptionId
      },
      onApprove: (data: IOnApproveCallbackData, actions: any) => {
        const me = this;
        me.stepSubmit.emit(data);

        // The below code does not currently work with ngx-paypal.
        // Error: Buyer access token not present - can not call smart api: /smart/api/billagmt/subscriptions/I-FXT2DTNHE5JE
        // There is an issue with the paypal SDK and could be used in the future once it's resolved.

        // actions.subscription.get()
        // .then((details: any) => {
        //   if (details.error === 'INSTRUMENT_DECLINED') {
        //     console.log("declined");
        //     return actions.restart();
        //   } else {
        //     console.log('actions.subscription.get', details);
        //     const { id, create_time, subscriber, plan_id } = details;
        //     const { email_address, name } = subscriber;
        //     const detailsObject: Submission = {
        //       'transaction_id': id,
        //       'plan_id': plan_id,
        //       'create_time': create_time,
        //       "email_address": email_address,
        //       "user": `${name.surname}, ${name.given_name}`,
        //     }
        //   }
        // })
        // .catch((error: Error) => {
        //   console.error(error);
        // });

      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err: Error) => {
        console.error(err);
        this.errorService.generateError(
          err,
          'Create Paypal Subscription',
          'An Error occurred creating the paypal Subscription. Please try again and reach out to support if the error continues.'
        )
      }
    };
  }
}
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Code } from '@app/@core/models/codes/code.model';
import { Message } from '@app/@core/models/messages/message.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { CodesService } from '@app/@shared/services/codes.service';
import { UserAccountValidator } from '@app/@shared/validators/user-account.validator';
import { UserService } from '@app/features/admin/services/user.service';
import { MessageService } from '@app/@shared/services/message.service';
import { environment } from '@env/environment';
import { Subscription, catchError, forkJoin, map, of, switchMap, take } from 'rxjs';
import { IOnApproveCallbackData } from 'ngx-paypal';
import { Submission } from '@app/@core/models/codes/submission.model';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit, OnDestroy {  
  @Input() step: number = 1;
  showPassword: boolean = false;
  signupForm: FormGroup;
  error: Error| null = null;
  selectedCode: Code;
  defaultCode: Code = {
    id: 'default_subscription',
    price: parseInt(environment.subscriptionPrice || '50'),
    active: true,
    codeType: 'discount',
    distountCode: '',
    subscriptionId: environment.subscriptionId || '',
    title: 'Online Programming'
  };
  subscriptionId: string = environment.subscriptionId || '';
  discountAttempts: string[] = [];
  discountApplied: boolean = false;
  discountFailed: boolean = false;
  referral: string;
  sendReferral: boolean = false;
  paramsSub: Subscription;
  paramsChecked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private codeService: CodesService,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private errorService: ErrorHandlingService
  ) {
    this.createForm();
  }

  ngOnInit(){
    this.selectedCode = this.defaultCode;
    this.paramsSub = this.route.queryParams
    .subscribe((params) => {
      this.paramsChecked = true;
      this.referral = params['referral'];
      const promoCode = params['promo'];
      if(promoCode){
        this.handleApplyPromo(promoCode);
      }
    })
  }

  createForm() {
    this.signupForm = this.fb.group({
      email: [
        "",
        [Validators.required, Validators.email],
        [UserAccountValidator.createValidator(this.auth)]
      ],
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(7)]],
    });
  }

  get f() { return this.signupForm.controls; }

  navigateToStep(step: number){
    this.step = step;
  }

  infoStepSubmit() {
    this.navigateToStep(2);
  };

  handlePaymentStepSubmit(data: IOnApproveCallbackData) {
    this.createUser(data);
    this.navigateToStep(3);
  };

  handleApplyPromo(code: string) {
    const codeSanitized = code.trim().toLocaleLowerCase();
    if(this.discountAttempts.includes(codeSanitized)){
      this.discountAttempts.push(codeSanitized);
      this.discountAttemptFailed();
      return;
    }

    this.codeService.getCodesByDiscountCode(codeSanitized)
    .pipe(
      take(1),
      catchError(() => of([]))
    )
    .subscribe({
      next: (codes) => {
        if (codes.length > 0) {
          const code = codes[0];
          this.selectedCode = code;
          this.subscriptionId = code.subscriptionId;
          this.discountApplied = true;
          this.discountFailed = false;
        } else {
          this.discountAttemptFailed();
        }
      }
    })
  }

  discountAttemptFailed() {
    this.discountFailed = true;
    setTimeout(() => {
      this.discountFailed = false;
    }, 3000);
  }

  createUser(data: IOnApproveCallbackData) {
    const { username, email, password } = this.signupForm.value;
    const submission = new Submission();
    submission.plan_id = data.subscriptionID;
    submission.create_time = new Date().getTime();
    submission.transaction_id = data.orderID;
    submission.email_address = email;
    submission.user = username;
    if(this.referral){
      submission.referral = this.referral;
    };

    this.authService.register({ email, password })
    .pipe(
      switchMap((credential) => {
        const { user } = credential;
        return this.userService.addNewUser(user.uid, email, username)
          .pipe(map(() => user))
      }),
      switchMap((user) => {
        const USER_SIGN_UP_MESSAGE = new Message(`${username} just created a new account!`, user.uid, "New User")
        return forkJoin([
          this.authService.sendEmailVerification(user),
          this.userService.addUserSubscription(user.uid, submission.plan_id, this.subscriptionId)
            .pipe(catchError(error => of(error))),
          this.messageService.addAdminUnreadMessage(USER_SIGN_UP_MESSAGE)
            .pipe(catchError(error => of(error))),
          this.codeService.addCodeDetailsSubmission(this.selectedCode, submission)
            .pipe(catchError(error => of(error))),
        ]).pipe(map(() => user.uid))
      }),
      switchMap((uid) => {
        const WELCOME_MESSAGE = new Message("Welcome to Jochum Strength Insider! We're excited to start this journey with you. Please fill out your welcome questionnaire (found under your username in the nav bar) so we can get the ball rolling on your first program. Keep chopping wood!", "welcome_message_id", "Welcome!");
        return this.messageService.addUserMessage(uid, WELCOME_MESSAGE)
          .pipe(switchMap((key) => {
            if(key){
              return this.messageService.addUserUnreadMessage(uid, key, WELCOME_MESSAGE)
            } else {
              return of("")
            }
          }))
      })
    )
    .subscribe({
      next: () => {
        console.log('User created');
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Create User Account',
          'An error occurred creating your account. Please make note of the current time and the email, username, and paypal account you used to create your account and notify a Jochum Strengh trainer by email.'
        );
      }
    })
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }
}


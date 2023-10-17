import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/@core/models/auth/user.model';
import { Code } from '@app/@core/models/codes/code.model';
import { Submission } from '@app/@core/models/codes/submission.model';
import { Message } from '@app/@core/models/messages/message.model';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { TOO_MANY_REQUESTS, USER_NOT_FOUND, WRONG_PASSWORD } from '@app/@core/utilities/firebase-auth-constants.utilities';
import { AuthService } from '@app/@shared/services/auth.service';
import { CodesService } from '@app/@shared/services/codes.service';
import { MessageService } from '@app/@shared/services/message.service';
import { UserService } from '@app/features/admin/services/user.service';
import { environment } from '@env/environment';
import { IOnApproveCallbackData } from 'ngx-paypal';
import { Subscription, catchError, forkJoin, of, take } from 'rxjs';


@Component({
  selector: 'app-resubscribe',
  templateUrl: './resubscribe.component.html',
  styleUrls: ['./resubscribe.component.css']
})
export class ResubscribeComponent implements OnInit, OnDestroy { 
  step: number = 1;
  authUser: User | null;
  userSub: Subscription;
  loginForm: FormGroup;
  loggedIn: boolean = false;
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

  constructor(
    private fb: FormBuilder,
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
    this.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  get f() { return this.loginForm.controls; }

  getCurrentUser(){
    this.userSub = this.authService.currentUser$
      .pipe(take(2))
      .subscribe(user => {
        if(!user){ return; }

        this.authUser = user;
        if(!this.loggedIn){
          this.navigateToStep(2);
        }
        this.loggedIn = true;
      });
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(7)]],
    });
  }

  login(){
    this.auth
    .login(this.loginForm.value)
    .subscribe({
      next: () => {
        this.getCurrentUser();
      },
      error: (error: Error) => {
        let errorMessage = "";
        if(error.message?.includes(WRONG_PASSWORD) || error.message?.includes(USER_NOT_FOUND)){
          errorMessage = "Email Or Password Is Incorrect."
        } else if (error.message?.includes(TOO_MANY_REQUESTS)) {
          errorMessage = "You have made too many failed login attempts. Please wait 30 minutes and try again. If you cannot remember your password try sending a password reset email or using email sign in."
        } else {
          errorMessage = "An error occurred signing in. Please try again and reach out to a Jochum Strength Coach if the error continues."
        }

        this.errorService.generateError(
          error,
          'Login Error',
          errorMessage
        );
      }
    })
  }

  navigateToStep(step: number){
    this.step = step;
  }

  handlePaymentStepSubmit(data: IOnApproveCallbackData) {
    this.resubscribe(data);
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

  resubscribe(data: IOnApproveCallbackData) {
    if(!this.authUser){
      return;
    }

    const { id, username, email} = this.authUser;
    
    const submission = new Submission();
    submission.plan_id = data.subscriptionID;
    submission.create_time = new Date().getTime();
    submission.transaction_id = data.orderID;
    submission.email_address = email;
    submission.user = username;
    submission.referral = 'Resubscribe';

    const USER_RESUBSCRIBE_MESSAGE = new Message(`${username} just resubscribed!`, id, "New Subscription!")
    forkJoin([
          this.userService.addUserSubscription(id, submission.plan_id, this.subscriptionId),
          this.userService.setUserIsActive(id, true)
            .pipe(catchError(error => of(error))),
          this.codeService.addCodeDetailsSubmission(this.selectedCode, submission)
            .pipe(catchError(error => of(error))),
          this.messageService.addAdminUnreadMessage(USER_RESUBSCRIBE_MESSAGE)
            .pipe(catchError(error => of(error))),
    ])
    .subscribe({
      next: () => {
        console.log('Subscription Complete');
        this.navigateToStep(3);
        this.authService.refreshCurrentUser();
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Resubcribe Error',
          "An error occurred resubscribing. Please check your paypal account and reach out to your Jochum Strength trainer if you have been charged for a new subscription."
        );
      }
    })
  }

}


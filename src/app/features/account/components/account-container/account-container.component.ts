import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { ToastService } from '@app/@core/services/toast.service';
import { TOO_MANY_REQUESTS, WRONG_PASSWORD } from '@app/@core/utilities/firebase-auth-constants.utilities';
import { LoginRequestModel } from '@app/@shared/models/auth/login-request.model';
import { PasswordResetModel } from '@app/@shared/models/auth/password-reset.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { MessageService } from '@app/@shared/services/message.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Observable, Subscription, catchError, finalize, forkJoin, map, of, switchMap, take } from 'rxjs';
import { AFTER_STRING, AccountService, BEFORE_STRING } from '../../services/account.service';
import { environment } from '@env/environment';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { UserSubscription } from '@app/@core/models/auth/user-subscription.model';
import { UserService } from '@app/features/admin/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.css']
})
export class AccountContainerComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;
  @Input() authStatus: User;
  sent: boolean = false;
  cancelled: boolean = false;
  workoutIds$: Observable<WorkoutId[]> = of([]);
  userSubscriptions: UserSubscription[] = [];
  userSubscriptionsSub: Subscription;

  afterSub: Subscription;
  beforeSub: Subscription;
  after: string = "";
  before: string = "";
  uploading: boolean = false;

  constructor(
    private workoutService: WorkoutService,
    private accountService: AccountService,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private lsService: LocalStorageService,
    private errorService: ErrorHandlingService,
    private router: Router
  ){ }

  ngOnInit() {
    this.workoutIds$ = this.workoutService.getWorkoutIds(this.user.id)
      .pipe(
        take(1),
        map((workoutIds: WorkoutId[]) => workoutIds !== null ? workoutIds : []),
        catchError(() => of([]))
      );

 
    this.fetchUserSubscriptions();
    this.getUserImages();
  }

  ngOnDestroy(): void {
    this.beforeSub?.unsubscribe();
    this.afterSub?.unsubscribe();
    this.userSubscriptionsSub?.unsubscribe();
  }

  getUserImages() {
    const cashedBefore: string = this.lsService.getData(BEFORE_STRING);
    this.beforeSub = of(cashedBefore)
      .pipe(switchMap((url) => {
        if(url){
          return of(url)
          .pipe(catchError(() => of("")));
        } else {
          return this.accountService.getUserBefore(this.user.id)
            .pipe(catchError(() => of("")))
        }
      }))
      .subscribe({
        next: (url) => this.before = url
      })

    const cashedAfter: string = this.lsService.getData(AFTER_STRING);
    this.afterSub = of(cashedAfter)
      .pipe(switchMap((url) => {
        if(url){
            return of(url)
            .pipe(catchError(() => of("")));
        } else {
          return this.accountService.getUserAfter(this.user.id)
            .pipe(catchError(() => of("")))
        }
      }))
      .subscribe({
        next: (url) => this.after = url
      })
  }

  uploadBefore(file: File) {
    this.uploading = true;
    this.accountService.uploadBefore(this.user.id, file)
    .pipe(
      catchError(() => of("")),
      finalize(() => {
        this.modalService.dismissAll();
        this.uploading = false;
      }),
    )
    .subscribe({
      next: (url) => this.before = url,
      error: (err) => {
        this.errorService.generateError(
          err,
          'Upload Image',
          'An error occurred while trying to upload your image. Please try and again and reach out to support if the error continues.'
        );
      }
    })
  }

  uploadAfter(file: File){
    this.uploading = true;
    this.accountService.uploadAfter(this.user.id, file)
    .pipe(
      catchError(() => of("")),
      finalize(() => {
        this.modalService.dismissAll();
        this.uploading = false;
      })
    )
    .subscribe({
      next: (url) => this.after = url,
      error: (err) => {
        this.errorService.generateError(
          err,
          'Upload Image',
          'An error occurred while trying to upload your image. Please try and again and reach out to support if the error continues.'
        );
      }
    })
  }

  removeBeforeImage(){
    this.accountService.deleteUserBefore(this.user.id)
    .subscribe({
      next: () => this.before = "",
      error: (err) => {
        this.errorService.generateError(
          err,
          'Remove Image',
          'An error occurred while trying to remove your image. Please try and again and reach out to support if the error continues.'
        );
      }
    })
  }

  removeAfterImage(){
    this.accountService.deleteUserAfter(this.user.id)
    .subscribe({
      next: () => this.after = "",
      error: (err) => {
        this.errorService.generateError(
          err,
          'Remove Image',
          'An error occurred while trying to remove your image. Please try and again and reach out to support if the error continues.'
        );
      }
    })
  }
 
  handleResetSubmitted(passwordReset: PasswordResetModel) {
    this.sent = true;
    const loginRequest = new LoginRequestModel(this.user.email, passwordReset.currentPassword)
    this.authService.login(loginRequest).pipe(
      switchMap((user) => {
        if(user){
          return this.authService.updatePassword(user.user, passwordReset.newPassword);
        } else {
          return EMPTY;
        }
      }),
      finalize(() => {
        setTimeout(() => {
          this.sent = false;
        }, 3000);
      })
    )
    .subscribe({
      next: () => {
        this.toastService.showSuccess();
      },
      error: (error: Error) => {
        let errorMessage = "An error occured changing your password. Please try again and reach out to support if the error continues."
        if(error.message?.includes(WRONG_PASSWORD)){
          errorMessage = "Your password is incorrect."
        } else if (error.message?.includes(TOO_MANY_REQUESTS)) {
          errorMessage = "You have made too many attempts using the incorrect password. Please wait 30 minutes and try again. If you cannot remember your password try sending a password reset email or using email sign in."
        }
        this.toastService.showError(errorMessage);
      }
    });
  }

  handleCancellation(subscription: UserSubscription) {
    const USER_CANCELLATION_MESSAGE = new Message(`${this.user.username} has cancelled their current subscription.`, this.user.id, "Cancellation")
    forkJoin([
      this.messageService.addAdminUnreadMessage(USER_CANCELLATION_MESSAGE),
      this.messageService.addUserMessage(this.user.id, USER_CANCELLATION_MESSAGE),
      this.userService.cancelUserSubscription(this.user.id, subscription.id)
    ])
    .pipe(
      finalize(() => {
        this.modalService.dismissAll();
      })
    )
    .subscribe({
      next: () => {
        this.toastService.showSuccess("A Jochum Strength trainer has been notified that you intend to cancel your current subscription.");
        this.cancelled = true;
        this.fetchUserSubscriptions();
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Account Cancellation',
          'An error occurred notifying a Jochum Strength trainer that you intend to cancel your account. Please try again and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    });
  }

  fetchUserSubscriptions(){
    this.userSubscriptionsSub?.unsubscribe();
    this.userSubscriptionsSub = this.userService.getUserSubscriptions(this.user.id)
    .pipe(
      take(1),
      map(subscriptions => subscriptions.reverse())
    )
    .subscribe({
      next: (subscriptions) => this.userSubscriptions = subscriptions,
      error: (err) => {
        this.errorService.generateError(
          err,
          'Get Subscriptions',
          'An error occurred while trying to get your subscriptions. Please refresh the page and reach out to support if the error continues.'
        );
      }
    })
  }

  handleSubscribe(){
    this.router.navigate(['auth/resubscribe']);
  }
}

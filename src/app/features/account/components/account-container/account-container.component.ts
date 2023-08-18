import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { ToastService } from '@app/@core/services/toast.service';
import { WRONG_PASSWORD } from '@app/@core/utilities/firebase-auth-constants.utilities';
import { LoginRequestModel } from '@app/@shared/models/auth/login-request.model';
import { PasswordResetModel } from '@app/@shared/models/auth/password-reset.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { EMPTY, Observable, Subscription, catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { AFTER_STRING, AccountService, BEFORE_STRING } from '../../services/account.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.css']
})
export class AccountContainerComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;
  @Input() authStatus: User;
  sent: boolean = false;
  workoutIds$: Observable<WorkoutId[]> = of([]);
  error: Error;

  afterSub: Subscription;
  beforeSub: Subscription;
  after: string = "";
  before: string = "";
  uploading: boolean = false;

  constructor(
    private workoutService: WorkoutService,
    private accountService: AccountService,
    private authService: AuthService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private lsService: LocalStorageService
  ){ }

  ngOnInit() {
    this.workoutIds$ = this.workoutService.getWorkoutIds(this.user.id)
      .pipe(
        map((workoutIds: WorkoutId[]) => workoutIds !== null ? workoutIds : []),
        catchError(() => of([]))
      );

    this.getUserImages();
  }

  ngOnDestroy(): void {
    this.beforeSub?.unsubscribe();
    this.afterSub?.unsubscribe();
  }

  getUserImages() {
    const cashedBefore: string = this.lsService.getData(BEFORE_STRING);
    this.beforeSub = of(cashedBefore)
      .pipe(switchMap((url) => {
        if(url){
          return of(url);
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
            return of(url);
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
      error: (err) => console.log(err)
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
      error: (err) => console.log(err)
    })
  }

  removeBeforeImage(){
    this.accountService.deleteUserBefore(this.user.id)
    .subscribe({
      next: () => this.before = "",
      error: (err) => console.log(err)
    })
  }

  removeAfterImage(){
    this.accountService.deleteUserAfter(this.user.id)
    .subscribe({
      next: () => this.after = "",
      error: (err) => console.log(err)
    })
  }

  removeImage(image: string){
    console.log('removeImage', image);
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
        const errorMessage = error.message.includes(WRONG_PASSWORD) ? "Wrong Password" : "An error occurred, Please try again."
        this.toastService.showError(errorMessage);
        this.error = error
      }
    });
  }
}
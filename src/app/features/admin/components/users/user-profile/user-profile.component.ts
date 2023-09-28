import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/@core/models/auth/user.model';
import { ToastService } from '@app/@core/services/toast.service';
import { AuthService } from '@app/@shared/services/auth.service';
import { UserService } from '@app/features/admin/services/user.service';
import { DietService } from '@app/features/diet/services/diet.service';
import { MessageService } from '@app/features/messages/services/message.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { WeighInService } from '@app/features/weigh-in/services/weigh-in.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize, forkJoin } from 'rxjs';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('clearMessagesModal') clearMessagesModal: any;
  @ViewChild('clearDataModal') clearDataModal: any;
  @ViewChild('editUserModal') editUserModal: any;

  @Input() user: User;
  @Input() adminUser: User;

  error: Error;
  userProfileForm: FormGroup;

  testSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private userService: UserService,
    private dietService: DietService,
    private messagesService: MessageService,
    private workoutService: WorkoutService,
    private weighInService: WeighInService,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(){
    this.userProfileForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      billingId: [this.user.billingId],
      surveySubmitted: [this.user.surveySubmitted],
    })
  }

  patchProfileForm(user: User){
    this.userProfileForm.patchValue({
      username: user.username,
      billingId: user.billingId || "",
      surveySubmitted: user.surveySubmitted || false,
    })
  }

  resetUserProfile(){
    this.patchProfileForm(this.user);
  }

  handleOpenModal(content: any){
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  updateUserProfile(){
    const { username, billingId, surveySubmitted } = this.userProfileForm.value;
    this.user.username = username;
    this.user.billingId = billingId;
    this.user.surveySubmitted = surveySubmitted;

    this.userService.updateUserProfile(this.user)
      .pipe(finalize(() => this.modalService.dismissAll()))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('User Profile Updated')
        },
        error: (err) => this.error = err
      });
  }

  openProfileModal(content: any) {
    this.resetUserProfile();
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  toggleUserIsActive() {
    this.userService.setUserIsActive(this.user.id, !this.user.ACTIVE)
    .subscribe({
      error: (err: Error) => console.log(err)
    })
  }

  clearUserMessages() {
    this.messagesService.removeUserMessages(this.user.id)
    .pipe(finalize(() => this.modalService.dismissAll()))
    .subscribe({
      next: () => this.toastService.showSuccess('User Messages Cleared'),
      error: (err) => this.error = err
    }); 
  }

  clearUserData() {
     const clearUserDataObservables = forkJoin([
      this.messagesService.removeUserMessages(this.user.id),
      this.workoutService.removeUserWorkouts(this.user.id),
      this.dietService.removeUserDiets(this.user.id),
      this.weighInService.removeUserWeighIns(this.user.id)
     ]);

     clearUserDataObservables
     .pipe(finalize(() => this.modalService.dismissAll()))
     .subscribe({
       next: () => this.toastService.showSuccess('User Data Cleared'),
       error: (err) => this.error = err
     }); 
  }

  sendPasswordReset(){
    this.authService.sendPasswordReset(this.user.email)
    .subscribe({
      next: () => this.toastService.showSuccess('Password Reset Email Sent'),
      error: (err) => this.error = err
    });
  }
}

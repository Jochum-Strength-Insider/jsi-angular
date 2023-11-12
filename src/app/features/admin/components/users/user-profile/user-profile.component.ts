import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSubscription } from '@app/@core/models/auth/user-subscription.model';
import { User } from '@app/@core/models/auth/user.model';
import { ToastService } from '@app/@core/services/toast.service';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { AuthService } from '@app/@shared/services/auth.service';
import { MessageService } from '@app/@shared/services/message.service';
import { UserService } from '@app/features/admin/services/user.service';
import { DietService } from '@app/features/diet/services/diet.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { WeighInService } from '@app/features/weigh-in/services/weigh-in.service';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, forkJoin, map, take } from 'rxjs';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnChanges {
  @ViewChild('clearMessagesModal') clearMessagesModal: any;
  @ViewChild('clearDataModal') clearDataModal: any;
  @ViewChild('editUserModal') editUserModal: any;

  @Input() user: User;
  @Input() adminUser: User;
  paypalUrl: string;
  selectedUserIsAdminUser: boolean = false;
  userSubscriptions: UserSubscription[] = [];
  selectedSubscription: UserSubscription | null = null;

  error: Error;
  userProfileForm: FormGroup;
  subcriptionForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private userService: UserService,
    private dietService: DietService,
    private messagesService: MessageService,
    private workoutService: WorkoutService,
    private weighInService: WeighInService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(){
    this.paypalUrl = environment.billingSubscriptionUrl || 'https://www.paypal.com/billing/subscriptions/';

    this.userProfileForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      surveySubmitted: [this.user.surveySubmitted],
      isAdmin: [this.user.ADMIN],
      isActive: [this.user.ACTIVE],
    })

    this.createSubscriptionForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['user'], () => {
      if(this.adminUser && this.user){
        this.selectedUserIsAdminUser = this.adminUser.id == this.user.id;
      }
    })
  }

  patchProfileForm(user: User){
    this.userProfileForm.patchValue({
      username: user.username,
      surveySubmitted: user.surveySubmitted || false,
      isAdmin: user.ADMIN || false,
      isActive: user.ACTIVE || false,
    })
  }

  resetUserProfile(){
    this.patchProfileForm(this.user);
  }

  get sf(){
    return this.subcriptionForm.controls;
  }

  createSubscriptionForm(){
    this.subcriptionForm = this.fb.group({
      billingId: ["", [Validators.required]],
      subscriptionId: "",
      active: true
    })
  }

  patchSubscriptionForm(subscription: UserSubscription | null){
    this.subcriptionForm.patchValue({
      billingId: subscription ? subscription.billingId : "",
      subscriptionId: subscription ? subscription.subscriptionId : "",
      active: subscription ? subscription.active : true
    })
  }

  resetSubscriptionForm(){
    this.patchSubscriptionForm(this.selectedSubscription)
  }

  handleOpenModal(content: any){
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  updateUserProfile(){
    const { username, isActive, surveySubmitted, isAdmin } = this.userProfileForm.value;
    this.user.username = username;
    this.user.surveySubmitted = surveySubmitted;
    this.user.ADMIN = isAdmin;
    this.user.ACTIVE = isActive;

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

  openUserSubscriptions(content: any){
    this.userService.getUserSubscriptions(this.user.id)
    .pipe(
      take(1),
      map(subscriptions => subscriptions.reverse())
    )
    .subscribe({
      next: (subscriptions) => {
        this.userSubscriptions = subscriptions;
        this.modalService.open(content, {
          size: 'lg',
          centered: true,
          backdrop: true,
        });
      },
      error: (err) => this.error = err
    })
  }

  openEditSubscriptionModal(content: any, subscription: UserSubscription | null){
    if(subscription){
      this.selectedSubscription = subscription;
      this.patchSubscriptionForm(subscription);
    } else {
      this.selectedSubscription = null;
      this.patchSubscriptionForm(null);
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openDeleteSubscriptionModal(content: any, subscription: UserSubscription){
    this.selectedSubscription = subscription;
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  deleteSelectedSubscription(){
    if(!this.selectedSubscription){ return }
    this.userService.removeUserSubscription(this.user.id, this.selectedSubscription.id)
    .pipe(finalize(() => this.modalService.dismissAll()))
    .subscribe({
      next: () => this.toastService.showSuccess('User Subscription Deleted'),
      error: (err) => this.error = err
    }); 
  }

  clearUserMessages() {
    forkJoin([
      this.messagesService.clearUserUnreadMessage(this.user.id),
      this.messagesService.removeUserMessages(this.user.id)
    ])
    .pipe(finalize(() => this.modalService.dismissAll()))
    .subscribe({
      next: () => this.toastService.showSuccess('User Messages Cleared'),
      error: (err) => this.error = err
    });
  }

  clearUserData() {
     const clearUserDataObservables = forkJoin([
      this.messagesService.removeUserMessages(this.user.id),
      this.messagesService.clearUserUnreadMessage(this.user.id),
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

  addSubscription(){
    const { billingId, subscriptionId, active } = this.subcriptionForm.value;
    this.userService.addUserSubscription(this.user.id, billingId, subscriptionId, active)
    .pipe(finalize(() => this.modalService.dismissAll()))
    .subscribe({
      next: () => this.toastService.showSuccess('Subscription Added'),
      error: (err) => this.error = err
    })
  }

  updateSubscription(){
    if(!this.selectedSubscription){ return }

    const { billingId, subscriptionId, active } = this.subcriptionForm.value;
    this.selectedSubscription.billingId = billingId;
    this.selectedSubscription.subscriptionId = subscriptionId;
    this.selectedSubscription.active = active;

    if(!active){
      this.selectedSubscription.cancelledAt = new Date().getTime();
    }

    this.userService.updateUserSubscription(this.user.id, this.selectedSubscription)
    .pipe(finalize(() => this.modalService.dismissAll()))
    .subscribe({
      next: () => this.toastService.showSuccess('Subscription Updated'),
      error: (err) => this.error = err
    })
  }
}

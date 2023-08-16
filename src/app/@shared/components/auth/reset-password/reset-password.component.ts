import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordResetModel } from '@app/@shared/models/auth/password-reset.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  @Output() formSubmitted = new EventEmitter<PasswordResetModel>();
  @Input() sent: boolean = false;
  showPassword: boolean = false;
  resetPasswordForm = this.fb.group({
    currentPassword: ["", Validators.required],
    newPassword: ["", [Validators.required, Validators.minLength(7)]],
  });
  
  constructor(private fb: FormBuilder){}

  get f() { return this.resetPasswordForm.controls };

  submit(){
    this.formSubmitted.emit(this.resetPasswordForm.getRawValue() as PasswordResetModel);
  }
}

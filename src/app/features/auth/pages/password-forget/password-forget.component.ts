import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-password-forget',
  templateUrl: './password-forget.component.html',
  styleUrls: ['./password-forget.component.css']
})
export class PasswordForgetComponent {
  emailRequestForm: FormGroup;
  error: Error| null = null;
  sent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.emailRequestForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.emailRequestForm.get('email');
  }

  onSubmit() {
    this.auth
      .sendPasswordReset(this.email?.value)
      .subscribe({
        next: () => {
          this.error = null;
          this.sent = true;        
        },
        error: (err: Error) => this.error = err
      })
  };
}

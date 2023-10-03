import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { EMPTY, catchError, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-email-signin',
  templateUrl: './email-signin.component.html',
  styleUrls: ['./email-signin.component.css']
})
export class EmailSigninComponent {
  emailRequestForm: FormGroup;
  errorMessage: string | null = null;
  sent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.emailRequestForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
    
    if (this.auth.getIsSignInWithEmailLink()) {
        var email: string | null = this.localStorage.getData("emailForSignIn");
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if(email){
          this.auth.doSignInWithEmailLink(email)
          .subscribe({
            next: () => {
              this.errorMessage = null;
              this.localStorage.removeData("emailForSignIn")
              this.router.navigateByUrl('/program')
            },
            error: (err: Error) => {
              this.errorMessage = 'An error occurred while trying to send a verification email. Please try and again and reach out to support if the error continues.';
              this.localStorage.removeData("emailForSignIn")
            }
          })
        }
    }
  }

  get email() {
    return this.emailRequestForm.get('email');
  }

  onSubmit() {
    const email = this.email?.value || "";
    this.auth.getSignInMethodsForEmail(email)
      .pipe(
        filter((res) => res.length > 0 ),
        switchMap(() => this.auth.sendSignInLinkToEmail(email)),
      )
      .subscribe({
        next: () => {
          this.errorMessage = null;
          this.sent = true;
          this.localStorage.saveData("emailForSignIn", email)
        },
        error: (err: Error) => {
          this.localStorage.removeData("emailForSignIn")
          this.errorMessage = "Account does not exist.";
        }
      })
  };
}

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
  error: Error| null = null;
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
              this.error = null;
              this.localStorage.removeData("emailForSignIn")
              this.router.navigateByUrl('/program')
            },
            error: (err: Error) => {
              this.localStorage.removeData("emailForSignIn")
              this.error = err;
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
    this.auth.getSignInMethodsFormEmail(email)
      .pipe(
        filter((res) => res.length > 0 ),
        switchMap(() => this.auth.sendSignInLinkToEmail(email)),
      )
      .subscribe({
        next: () => {
          this.error = null;
          this.sent = true;
          this.localStorage.saveData("emailForSignIn", email)
        },
        error: (err: Error) => {
          this.localStorage.removeData("emailForSignIn")
          this.error = new Error("Account does not exist. Please contact jochumstrength@gmail.com to become an Insider or for more information about Jochum Strength Insider.");
        }
      })
  };
}

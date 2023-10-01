import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '@app/@core/utilities/firebase-auth-constants.utilities';
import { AuthService } from '@app/@shared/services/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  testEmail : string = environment.login || "";
  testPassword : string = environment.password || "";
  loginForm: FormGroup;
  error: Error| null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [this.testEmail, [Validators.required, Validators.email]],
      password: [this.testPassword, Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }
  
  onSubmit() {
    this.auth
      .login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.error = null;
          this.errorMessage = null;
          this.router.navigateByUrl('/program')
        },
        error: (error: Error) => {
          this.error = error;
          if(error.message?.includes(WRONG_PASSWORD) || error.message?.includes(USER_NOT_FOUND)){
            this.errorMessage = "Email Or Password Is Incorrect."
          } else {
            this.errorMessage = "An error occurred signing in. Please try again and reach out to a Jochum Strength Coach if the error continues."
          }
        }
      })
  };
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/@core/services/toast.service';
import { TOO_MANY_REQUESTS, USER_NOT_FOUND, WRONG_PASSWORD } from '@app/@core/utilities/firebase-auth-constants.utilities';
import { AuthService } from '@app/@shared/services/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-navigation-login-form',
  templateUrl: './navigation-login-form.component.html',
  styleUrls: ['./navigation-login-form.component.css']

})
export class NavigationLoginFormComponent {
  email: string = '';
  password: string = '';

  testEmail : string = environment.login || "";
  testPassword : string = environment.password || "";

  loginForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [this.testEmail, [Validators.required, Validators.email]],
      password: [this.testPassword, Validators.required],
    });
  }
    
  onSubmit() {
    this.authService
      .login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/program')
        },
        error: (error: Error) => {
          let errorMessage = 'An error occurred signing in. Please try again and reach out to a Jochum Strength Coach if the error continues.';
          if(error.message?.includes(WRONG_PASSWORD) || error.message?.includes(USER_NOT_FOUND)){
            errorMessage = "Email Or Password Is Incorrect."
          } else if (error.message?.includes(TOO_MANY_REQUESTS)) {
            errorMessage = "You have made too many failed login attempts. Please wait 30 minutes and try again. If you cannot remember your password try sending a password reset email or using email sign in."
          }
          this.toastService.showError(errorMessage);
          this.router.navigateByUrl('/auth/signin')
        }
      })
  };
  
}

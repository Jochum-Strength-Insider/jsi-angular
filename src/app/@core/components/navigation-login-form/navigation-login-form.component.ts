import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/@core/services/toast.service';
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
  error: Error | null;

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
          this.error = null;
          this.router.navigateByUrl('/program')
        },
        error: (error: Error) => {
          this.error = error;
          this.toastService.showError('Email or Password is invalid')
          this.router.navigateByUrl('/auth/signin')
        }
      })
  };
  
}

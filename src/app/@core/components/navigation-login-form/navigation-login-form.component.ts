import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-navigation-login-form',
  templateUrl: './navigation-login-form.component.html',
  styleUrls: ['./navigation-login-form.component.css']
})
export class NavigationLoginFormComponent {
  email: string = '';
  password: string = '';
  error: Error | null;

  testEmail : string = 'speedyneppl@gmail.com';
  testPassword : string = 'Ins1derTr@ding';

  loginForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
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
      .then(() => {
        this.error = null;
        this.router.navigateByUrl('/program')
      })
      .catch(error => {
        this.error = error;
        this.router.navigateByUrl('/signin')
      });
  };
  
}

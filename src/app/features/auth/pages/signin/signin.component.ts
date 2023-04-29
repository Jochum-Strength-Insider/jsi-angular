import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  testEmail : string = environment['login'] || "";
  testPassword : string = environment['password'] || "";
  loginForm: FormGroup;
  error: Error| null = null;

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
      .then(() => {
        this.error = null;
        this.router.navigateByUrl('/program')
      })
      .catch(error => {
        this.error = error;
      });
  };
}

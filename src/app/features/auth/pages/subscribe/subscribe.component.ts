import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Code } from '@app/@core/models/codes/code.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { CodesService } from '@app/@shared/services/codes.service';
import { UserAccountValidator } from '@app/@shared/validators/user-account.validator';
import { environment } from '@env/environment';
import { Subscription, combineLatestWith, filter } from 'rxjs';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit, OnDestroy {
  // TO DO: Don't pull all of the codes.
  // Set up an api call to check if the code exists in the codes array on demand. 
  
  @Input() step: number = 2;
  showPassword: boolean = false;
  signupForm: FormGroup;
  error: Error| null = null;
  discountCodes: Code[] = [];
  selectedCode: Code;
  defaultCode: Code = {
    id: '',
    price: parseInt(environment.subscriptionPrice || '50'),
    active: true,
    codeType: 'discount',
    distountCode: '',
    subscriptionId: environment.subscriptionId || '',
    title: 'Online Programming'
  };
  discountApplied: boolean = false;
  discountFailed: boolean = false;
  referral: string;
  sendReferral: boolean = false;
  paramsSub: Subscription;
  paramsChecked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private codeService: CodesService
  ) {
    this.createForm();
  }

  ngOnInit(){
    this.selectedCode = this.defaultCode;
    this.paramsSub = this.codeService.getCodes()
    .pipe(
      combineLatestWith(
        this.route.queryParams
      ),
    )
    .subscribe(([codes, params]) => {
      this.paramsChecked = true;
      this.discountCodes = codes;
      this.referral = params['referral'];
      const promoCode = params['promo'];
      if(promoCode){
        this.handleApplyPromo(promoCode);
      }
    })
    
    // this.paramsSub = this.route.queryParams
    // .pipe(
    //   filter(params => params['referral'] || params['promo'])
    // )
    // .subscribe(params => {
    //   this.referral = params['referral'];
    //   const promoCode = params['promo'];
    //   if(promoCode){
    //     console.log('params', params);
    //     this.handleApplyPromo(promoCode);
    //   }
    // });
  }

  createForm() {
    this.signupForm = this.fb.group({
      email: ["", [Validators.required, Validators.email],[UserAccountValidator.createValidator(this.auth)]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(7)]],
    });
  }

  get f() { return this.signupForm.controls; }

  next() {
    this.step >= 2 ? 3 : this.step += 1;
  }

  prev() {
    this.step <= 1 ? 1 : this.step -= 1;
  }

  infoStepSubmit(){
    this.next();
  };

  handlePaymentStepSubmit() {
    this.createUser();
    this.next();
  };

  handleApplyPromo(code: string, referral?: string) {
    const matchingPromo = this.discountCodes
      .find(promo => promo.distountCode === code.trim().toLocaleLowerCase());

    if (matchingPromo) {
      this.selectedCode = matchingPromo;
      this.discountFailed = false;
      this.discountApplied = true;
      if (matchingPromo.codeType === "referral" && referral) {
        this.referral = referral;
      }
    } else {
      this.discountFailed = true;
      setTimeout(() => {
        this.discountFailed = false;
      }, 3000);
    }
  }

  createUser(){
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }
}


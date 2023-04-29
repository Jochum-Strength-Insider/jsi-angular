import { Component, Output, EventEmitter, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Code } from '@app/@core/models/codes/code.model';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit, OnChanges {
  @Output() applyPromo = new EventEmitter<string>();
  @Input() discountApplied: boolean = false;
  @Input() discountFailed: boolean = false;
  @Input() appliedCode: Code;
  @Input() defaultAmount: number;
  discountedAmount: number = 0;
  promoForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.promoForm = this.fb.group({
      promo: ["", [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.discountedAmount = this.defaultAmount - this.appliedCode.price;
    if(this.discountApplied){
      this.f['promo']?.disable();
    }
  }

  get f() { return this.promoForm.controls; }
  
  applyDiscount() {
    this.applyPromo.emit(this.f['promo'].value);
  };
}

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Code } from '@app/@core/models/codes/code.model';
import { Submission } from '@app/@core/models/codes/submission.model';
import { ToastService } from '@app/@core/services/toast.service';
import { CodesService } from '@app/@shared/services/codes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize } from 'rxjs';

// TODO
// Separate components
// Add search pattern to this page too

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.css']
})
export class CodesComponent implements OnInit, AfterViewInit, OnDestroy {
  codesSub: Subscription;
  searchSub: Subscription;
  codes: Code[] = [];
  filteredCodes: Code[] = [];
  selectedCode: Code | null = null;
  submissions: Submission[] = [];
  codeForm: FormGroup;
  search: string = "";
  searchForm: FormGroup;
  hoverStates: boolean[] = [];
  edit: boolean = true;

  @ViewChild('addModal') addModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  error: Error;

  page: number = 1;
  pageSize: number = 10;

  constructor(
    private codesService: CodesService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.fetchCodes();

    this.codeForm = this.fb.group({
      title: ["", Validators.required],
      subscriptionId: ["", Validators.required],
      discountCode: ["", Validators.required],
      price: [50, [
        Validators.required,
        Validators.min(1)
      ]],
      codeType: ["discount", Validators.required],
    });

    this.searchForm = this.fb.group({
      search: ["", Validators.required],
    });
  }

  ngAfterViewInit(){   
    this.searchSub = this.searchForm.controls['search']
      .valueChanges.subscribe(val => {
        this.search = val;
        this.filterCodes(val);
      });
  }

  filterCodes(value: string){
    this.filteredCodes = this.codes.filter(code => code.title.toLowerCase().indexOf(value.toLowerCase()) > -1 )
  }

  get f() { return this.codeForm.controls; }

  ngOnDestroy(){
    this.codesSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  clearCodeForm(){
    this.codeForm.patchValue({
      title: "",
      subscriptionId: "",
      discountCode: "",
      price: 50,
      codeType: "discount",
    });
  }

  resetCodeForm(){
    this.codeForm.patchValue({
      title: this.selectedCode ? this.selectedCode.title : "",
      subscriptionId: this.selectedCode ? this.selectedCode.subscriptionId : "",
      discountCode: this.selectedCode ? this.selectedCode.distountCode : "",
      price: this.selectedCode ? this.selectedCode.price : 50,
      codeType: this.selectedCode ? this.selectedCode.codeType : "discount",
    });
  }
  
  patchCodeForm(code: Code) {
    this.codeForm.patchValue({
      title: code.title,
      subscriptionId: code.subscriptionId,
      discountCode: code.distountCode,
      price: code.price,
      codeType: code.codeType,
    });
  }

  fetchCodes(): void {
    this.codesSub = this.codesService.getCodes()
    .subscribe({
      next: (codes) => {
        this.codes = codes;
        this.filterCodes(this.search);
      },
      error: (err: Error) => {
        console.log(err)
        this.error = err;
      }
    })
  }

  openCodeModal(content: any, code: Code | null) {
    this.edit = true;
    if(code){
      this.selectedCode = code;
      this.patchCodeForm(code);
    } else {
      this.selectedCode = null;
      this.clearCodeForm();
      this.codeForm.patchValue({
        title: this.searchForm.controls['search'].value,
      });  
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openRemoveModal(code: Code){
    this.selectedCode = code;
    this.modalService.open(this.deleteModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  addCodes(){
    const code = new Code();
    code.title = this.f['title'].value;
    code.subscriptionId = this.f['subscriptionId'].value;
    code.distountCode = this.f['discountCode'].value;
    code.price = this.f['price'].value;
    code.codeType = this.f['codeType'].value;

    this.codesService.addCode(code)
    .subscribe({
      next: () => {
        this.toastService.showSuccess();
        this.modalService.dismissAll();
      },
      error: (error: Error) => {
        this.toastService.showError();
        this.error = error
      }
    });
  }

  toggleCodeIsActive(code: Code){
    this.codesService.toggleCodeIsActive(code)
    .subscribe({
      next: () => console.log('toggle'),
      error: (err: Error) => console.log(err)
    })
  }

  deleteSelectedCode() {
    if(this.selectedCode){
      this.codesService.removeCode(this.selectedCode)
      .pipe(finalize(() => {
        this.modalService.dismissAll();
        this.selectedCode = null;
      }))
      .subscribe({
        next: () => console.log('remove'),
        error: (err: Error) => console.log(err),
      })
    }
  }

  showReferrals(code: Code){
    this.codesService.getCodeDetailsSubmissions(code)
    .subscribe({
      next: (details) => {
        this.submissions = details;
        this.edit = false;
      },
      error: (err: Error) => console.log(err)
    })
  }

  updateCode(){
    if(this.selectedCode){
      this.selectedCode.title = this.f['title'].value;
      this.selectedCode.subscriptionId = this.f['subscriptionId'].value;
      this.selectedCode.distountCode = this.f['discountCode'].value;
      this.selectedCode.price = this.f['price'].value;
      this.selectedCode.codeType = this.f['codeType'].value;

      this.codesService.saveCode(this.selectedCode)
      .subscribe({
        next: () => {
          this.toastService.showSuccess();
        },
        error: (error: Error) => {
          this.toastService.showError();
          this.error = error
        }
      });
    }
  }
}

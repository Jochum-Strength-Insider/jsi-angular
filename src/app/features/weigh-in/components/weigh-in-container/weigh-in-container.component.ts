import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeighIn } from '@app/@core/models/weigh-in/weigh-in.model';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription, delay, finalize } from 'rxjs';
import { WeighInService } from '../../services/weigh-in.service';

@Component({
  selector: 'app-weigh-in-container',
  templateUrl: './weigh-in-container.component.html',
  styleUrls: ['./weigh-in-container.component.css']
})
export class WeighInContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() uid: string;
  @Input() isAdmin: boolean = false;
  @Output() showAddModal = new EventEmitter();
  @ViewChild('addModal') addModal: any;
  weignInSub: Subscription;
  mostRecentSub: Subscription;
  weighIns: WeighIn[] = [];
  weightForm: FormGroup;
  error: Error | null;
  currentDate: Date = new Date();
  queryDate: Date = new Date();
  isCurrentMonth: boolean = true;
  showModal: boolean = false;
  alreadyCheckedIn: boolean = false;
  isCollapsed: boolean = true;

  constructor(
    private fb: FormBuilder,
    private weighInService: WeighInService,
    private lsService: LocalStorageService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getWeighIns();

    this.weightForm = this.fb.group({
      weight: [{value: 180, disabled: false}, [
          Validators.required,
          Validators.min(1),
          Validators.max(999)
        ]
      ],
    });
  }

  ngAfterViewInit(){
    this.mostRecentSub = this.weighInService.getMostRecentUserWeighIn(this.uid)
    .pipe(delay(1000))
    .subscribe({
      next: (weighIns: WeighIn[]) => {
        if(weighIns.length > 0){
          const mostRecent = weighIns[0];
          this.weightForm.patchValue({ weight: mostRecent.weight });
          const nowString = moment(this.currentDate).format("MMM D");
          const lastDatestring = moment(mostRecent.date).format("MMM D");

          if(this.alreadyCheckedIn){
            this.weight?.disable();
            return;
          }

          if (lastDatestring === nowString) {
            this.alreadyCheckedIn = true;
            this.weight?.disable();
          } else {
            this.alreadyCheckedIn = false;
            this.weight?.enable();
            if(!this.modalService.hasOpenModals()){
              this.openAddModal(this.addModal);
            }
          }
        }
      }
    })
  }

  get weight() {
    return this.weightForm.get('weight');
  }

  getWeighIns(){
    this.weignInSub = this.weighInService
      .getWeighInsByMonthAndUser(this.uid, this.queryDate)
      .subscribe({
        next: result => {
          this.weighIns = result;
        },
        error: error => {
          this.error = error;
          this.clearWeighIns();
        }
      })

    this.checkIsCurrentMonth();
  }

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  clearWeighIns() {
    this.lsService.removeData('chartData');
    this.weighIns = [];
  }

  addWeighIn() {
    if(this.weightForm.invalid) {
      return;
    }
    const weighIn = new WeighIn(this.currentDate.getTime(), this.weight?.value);
    this.weighInService.addUserWeighIn(this.uid, weighIn)
      .pipe(finalize(() => this.modalService.dismissAll()))
      .subscribe({
        next: () => {
          this.alreadyCheckedIn = true;
          this.getWeighIns();
        },
        error: (err: Error) => {
          this.error = err
        }
      })
  }

  handleChangeQueryDate(date: number) {
    this.queryDate = new Date(date);
    this.getWeighIns();
  }

  checkIsCurrentMonth() {
    const startOfMonth = moment(this.currentDate).startOf("M").format("x");
    const startOfQuery = moment(this.queryDate).startOf("M").format("x");
    this.isCurrentMonth = startOfMonth === startOfQuery;
  }

  ngOnDestroy(): void {
    this.weignInSub.unsubscribe();
    this.mostRecentSub.unsubscribe();
  }
}

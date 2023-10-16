import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeighIn } from '@app/@core/models/weigh-in/weigh-in.model';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription, delay, finalize } from 'rxjs';
import { WeighInService } from '../../services/weigh-in.service';
import { User } from '@app/@core/models/auth/user.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';

@Component({
  selector: 'app-weigh-in-container',
  templateUrl: './weigh-in-container.component.html',
  styleUrls: ['./weigh-in-container.component.css']
})
export class WeighInContainerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() user: User;
  @Input() adminUser: User | null = null;
  @Output() showAddModal = new EventEmitter();
  @ViewChild('addModal') addModal: any;

  weignInSub: Subscription;
  mostRecentSub: Subscription;
  weighIns: WeighIn[] = [];
  weightForm: FormGroup;
  currentDate: Date = new Date();
  queryDate: Date = new Date();
  isCurrentMonth: boolean = true;
  showModal: boolean = false;
  alreadyCheckedIn: boolean = false;
  isCollapsed: boolean = true;
  chartTitle: string = '';

  constructor(
    private fb: FormBuilder,
    private weighInService: WeighInService,
    private lsService: LocalStorageService,
    private modalService: NgbModal,
    private errorService: ErrorHandlingService
  ) { }

  ngOnInit(): void {
    this.getWeighIns();
    this.setChartTitle(this.queryDate.getTime());

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
    if(this.adminUser === null) {
      this.getMostRecentWeighIn();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged( changes['user'], () => {
      this.getWeighIns();
    });
  }

  ngOnDestroy(): void {
    this.weignInSub?.unsubscribe();
    this.mostRecentSub?.unsubscribe();
  }

  get weight() {
    return this.weightForm.get('weight');
  }

  getWeighIns(){
    this.weignInSub = this.weighInService
      .getWeighInsByMonthAndUser(this.user.id, this.queryDate)
      .subscribe({
        next: result => {
          this.weighIns = result;
        },
        error: (err) => {
          this.clearWeighIns();
          this.errorService.generateError(
            err,
            'Get User Weigh Ins',
            'An error occurred getting your weigh ins. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
          );
        }
      })

    this.checkIsCurrentMonth();
  }

  getMostRecentWeighIn(): void {
    this.mostRecentSub = this.weighInService.getMostRecentUserWeighIn(this.user.id)
    .pipe(delay(500))
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
    if(this.weightForm.invalid || this.adminUser !== null) {
      return;
    }

    const weighIn = new WeighIn(this.currentDate.getTime(), this.weight?.value);
    this.weighInService.addUserWeighIn(this.user.id, weighIn)
      .pipe(finalize(() => this.modalService.dismissAll()))
      .subscribe({
        next: () => {
          this.alreadyCheckedIn = true;
          this.getWeighIns();
        },
        error: (err) => {
          this.errorService.generateError(
            err,
            'Add User Weigh In',
            'An error occurred saving your weigh ins. Please try again reach out to your Jochum Strengh trainer if the error continues.'
          );
        }
      })
  }

  handleChangeQueryDate(date: number) {
    this.queryDate = new Date(date);
    this.setChartTitle(date);
    this.getWeighIns();
  }

  checkIsCurrentMonth() {
    const startOfMonth = moment(this.currentDate).startOf("M").format("x");
    const startOfQuery = moment(this.queryDate).startOf("M").format("x");
    this.isCurrentMonth = startOfMonth === startOfQuery;
  }

  setChartTitle(date: number) {
    this.chartTitle = moment(date).format('MMMM YYYY');
  }
}

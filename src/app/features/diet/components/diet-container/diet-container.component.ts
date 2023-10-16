import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/@core/models/auth/user.model';
import { DietId } from '@app/@core/models/diet/diet-id.model';
import { Diet } from '@app/@core/models/diet/diet.model';
import { ToastService } from '@app/@core/services/toast.service';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { NgbAccordionDirective, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize, tap, timer } from 'rxjs';
import { DietService } from '../../services/diet.service';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';

@Component({
  selector: 'app-diet-container',
  templateUrl: './diet-container.component.html',
  styleUrls: ['./diet-container.component.css']
})
export class DietContainerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() user: User;
  @Input() adminUser: User | null = null;
  @ViewChild('addModal') addModal: any;
  @ViewChild('accordion') accItem: NgbAccordionDirective;
  @ViewChildren('panel') panels: QueryList<ElementRef>;

  diets: Diet[] = [];
  dietSub: Subscription;
  mostRecentSub: Subscription;
  timerSub: Subscription;
  dateForm: FormGroup;
  currentDate: Date = new Date();
  queryDate: Date = new Date();
  isCurrentMonth: boolean = true;
  alreadyCheckedIn: boolean = false;
  isCollapsed: boolean = true;
  checkIns: DietId[] = [];

  lastVisible: string = "";
  loading: boolean = false;
  show: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dietService: DietService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private errorService: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      date: [{value: formatDate(this.currentDate,'yyyy-MM-dd','en'), disabled: false }, [
          Validators.required
        ]
      ],
    });

    this.fetchDiets();
  }

  ngAfterViewInit(): void {
    if(!this.adminUser){
      this.timerSub = timer(1000).subscribe(() => this.checkDietSheet());
    }
  }

  ngOnDestroy(): void {
    this.dietSub?.unsubscribe();
    this.mostRecentSub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['user'], () => {
      this.checkIns = [];
      this.fetchDiets();
    })
  }

  get date() {
    return this.dateForm.get('date');
  }
  
  addDateSheet() {
    if(this.dateForm.invalid){
      return;
    }
    
    if(this.date?.value){
      this.dietService.addUserDietSheet(this.user.id, this.date.value)
        .pipe(finalize(() => this.modalService.dismissAll()))
        .subscribe({
          next: (dietId) => {
            this.addDietIdToCheckIns(dietId);
            this.fetchDiets();
          },
          error: (err) => {
            this.errorService.generateError(
              err,
              'Add Diet Page',
              'An error occurred while trying to add a diet page. Please try again and reach out to your Jochum Strengh trainer if the error continues.'
            );
          }
        });
    }
  }

  handleChangeQueryDate(event: {date: number, check: boolean}) {
    this.queryDate = new Date(event.date);
    if(event.check){
      const dietId = this.getDietIdStringByDate(event.date);
      if(dietId !== null){
        this.toggleDietSheetPanel(dietId);
      } else {
        this.checkDietSheet()
      }
    } else {
      this.fetchDiets();
    }
  }

  patchForm(date: Date){
    this.dateForm.patchValue({date: formatDate(date,'yyyy-MM-dd','en')})
  }

  fetchDiets() {
    this.dietSub = this.dietService.getUserDietsForWeekByDate(this.user.id, this.queryDate)
    .pipe(
      tap((diets: Diet[]) =>
          diets.forEach(diet =>
            this.addDietIdToCheckIns({[diet.id]: diet.createdAt})
          )
        )
      )
    .subscribe({
      next: (diets: Diet[]) => this.diets = diets.sort(((a: Diet, b: Diet) => b.createdAt - a.createdAt)),
      error: (err) => {
        this.errorService.generateError(
          err,
          'Get Diet Pages',
          'An error occurred while trying to get your diet pages. Please try again and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    })
  }

  addDietIdToCheckIns(dietId: DietId): DietId | null {
    const dietDate = dietId[Object.keys(dietId)[0]];
    const dietIdIndex = this.checkIns.findIndex(item => dietDate == item[Object.keys(item)[0]]);
    if(dietIdIndex === -1){
      this.checkIns.push(dietId);
      return null;
    } else {
      return dietId;
    }
  }

  getDietIdStringByDate(date: number): string | null {
    // find the event key of the checkin by the query date
    const dietIdObject = this.checkIns.find(item => date == item[Object.keys(item)[0]]);
    if(dietIdObject !== undefined){
      return Object.keys(dietIdObject)[0] 
    } else {
      return null
    }
  }

  checkDietSheet() {
    this.dietService.getUserDietIdByDate(this.user.id, this.queryDate)
    .subscribe(checkedIn => {
      if(checkedIn){
        this.addDietIdToCheckIns(checkedIn);
        const id = Object.keys(checkedIn)[0];
        this.toggleDietSheetPanel(id);
      } else {
        this.patchForm(this.queryDate);
        this.openAddDietModal(this.addModal);
      }
    });
  }

  handleSaveDiet(diet: Diet){
    this.dietService.saveUserDiet(this.user.id, diet)
    .subscribe({
      next: () => {
        this.toastService.showSuccess();
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Save Diet Page',
          'An error occurred while trying to save the diet page. Please try again and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    });
  }

  openAddDietModal(content: any) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  toggleDietSheetPanel(dietId: string) {
    const isExpanded = this.accItem.isExpanded(dietId);
    if(isExpanded){
      this.accItem.collapseAll();
    } else {
      this.accItem.collapseAll();
      this.accItem.toggle(dietId);
      const panel = this.panels.find(panel => panel.nativeElement.id == dietId);
      panel?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
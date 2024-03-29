import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { Folder } from '@app/@core/models/program/folder.model';
import { ProgramId } from '@app/@core/models/program/program-id.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { ToastService } from '@app/@core/services/toast.service';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { FOLDERS_STRING, PROGRAM_IDS_STRING, ProgramService, QUICK_SAVE_ID_STRING } from '@app/features/admin/services/programs.service';
import { UserService } from '@app/features/admin/services/user.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, finalize, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-user-programs-list',
  templateUrl: './user-programs-list.component.html',
  styleUrls: ['./user-programs-list.component.css']
})
export class UserProgramsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() user: User;
  @Input() adminUser: User;
  @ViewChild('addProgramModal') addProgramModal: any;
  @ViewChild('deleteProgramModal') deleteProgramModal: any;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler() {
    // Clear subscriptions on window unload
    this.ngOnDestroy();
  }
  
  currentUserId$ = new Subject<string>();
  workoutIdsSub: Subscription;
  workoutIds: WorkoutId[] = [];
  filteredWorkouts: WorkoutId[] = [];
  selectedWorkout: WorkoutId | null = null;

  programIdsSub: Subscription;
  programIds: ProgramId[] = [];
  filteredProgramIds: ProgramId[] = [];

  quickSaveSub: Subscription;
  quickSaveProgram: ProgramId | null = null;

  foldersSub: Subscription;
  folders: Folder[] = [];
  folderId: string | null = null;
  folder: Folder;
  
  searchSub: Subscription;
  search: string = "";
  searchForm = this.fb.group({
    search: ["", Validators.required],
  });

  programForm = this.fb.group({
    title: ["", Validators.required],
  });

  existingProgramForm = this.fb.group({
    programId: ["", Validators.required]
  });

  error: Error;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private programService: ProgramService,
    private workoutService: WorkoutService,
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private lsService: LocalStorageService
  ) {}

  ngOnInit(){
    this.fetchProgramsIds();
    this.fetchFolders();
    this.fetchUserWorkouts();
    this.fetchQuickSave();
    this.switchCurrentUser(this.user.id);
  }
  
  ngAfterViewInit(){   
    this.searchSub = this.searchForm.controls['search']
      .valueChanges.subscribe(val => { 
        this.search = val || "";
        this.filterWorkouts(this.search);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['user'].firstChange) {
      ifPropChanged(changes['user'], (user) => this.switchCurrentUser(user.id));
    }
  }
  
  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.programIdsSub?.unsubscribe();
    this.workoutIdsSub?.unsubscribe();
    this.foldersSub?.unsubscribe();
    this.quickSaveSub?.unsubscribe();
  }

  switchCurrentUser(uid: string){
    this.currentUserId$.next(uid);
  }

  fetchProgramsIds() {
    const cashedProgramIds: ProgramId[] = this.lsService.getParseData(PROGRAM_IDS_STRING);
    this.programIdsSub = of(cashedProgramIds)
      .pipe(switchMap((programs) => {
        if(programs){
          return of(programs);
        } else {
          return this.programService.getProgramIds();
        }
      }))
      .subscribe({
        next: (programs) => {
          this.programIds = programs;
          this.filteredProgramIds = programs;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  fetchUserWorkouts() {
    this.workoutIdsSub = 
    this.currentUserId$.pipe(
      switchMap((uid) => this.workoutService.getWorkoutIds(uid))
    )
    .subscribe({
      next: results => {
        this.workoutIds = results.sort((a, b) => b.createdAt - a.createdAt);
        this.filterWorkouts(this.search);
      },
      error: (err: Error) => {
        console.log(err)
        this.error = err;
      },
    });
  }

  fetchFolders() {
    const cashedFolders: Folder[] = this.lsService.getParseData(FOLDERS_STRING);
    this.foldersSub = of(cashedFolders)
      .pipe(switchMap((folders) => {
        if(folders){
          return of(folders);
        } else {
          return this.programService.getFolders();
        }
      }))
      .subscribe({
        next: (folders) => {
          this.folders = folders;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  fetchQuickSave() {
    const cachedQuickSaveId: ProgramId = this.lsService.getParseData(QUICK_SAVE_ID_STRING);
    this.quickSaveSub = of(cachedQuickSaveId)
      .pipe(switchMap((QuickSaveId) => {
        if(QuickSaveId){
          return of(QuickSaveId);
        } else {
          return this.programService.getQuickSaveId();
        }
      }))
      .subscribe({
        next: (id) => {
          this.quickSaveProgram = id;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  folderSelected(target: EventTarget | null){
    const value = (target as HTMLSelectElement)?.value;
    if(value === 'all'){
      this.filteredProgramIds = this.programIds;
      const id = this.filteredProgramIds.length > 0 ? this.filteredProgramIds[0].id : '';
      this.existingProgramForm.controls['programId'].patchValue(id);
      return;
    }
    if(value === 'uncategorized'){
      this.filteredProgramIds = this.programIds.filter( x => x.parentFolderId === undefined);
      const id = this.filteredProgramIds.length > 0 ? this.filteredProgramIds[0].id : '';
      this.existingProgramForm.controls['programId'].patchValue(id);
      return;
    }
    this.filteredProgramIds = this.programIds.filter( x => x.parentFolderId === value);
    const id = this.filteredProgramIds.length > 0 ? this.filteredProgramIds[0].id : '';
    this.existingProgramForm.controls['programId'].patchValue(id);
  }

  filterWorkouts(value: string){
    this.filteredWorkouts = this.workoutIds.filter(workout => workout.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1 )
  }

  openAddProgramModal(content: any, workout: WorkoutId | null) {
    if(workout !== null){
      this.router.navigate(['program/', workout.id], {relativeTo: this.route})
      return;
    }
    this.programForm.patchValue({
      title: this.searchForm.controls['search'].value
    });    

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openRemoveModal(workout: WorkoutId){
    this.selectedWorkout = workout;
    this.modalService.open(this.deleteProgramModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  addProgram() {
    if(this.programForm.invalid){ return; }
    const title: string = this.programForm.controls['title'].value || "";
    this.programService.addDefaultProgramToUserWorkouts(this.user.id, title)
    .pipe(finalize(() => {
      this.modalService.dismissAll();
    }))
    .subscribe({
      next: () => {
        this.toastService.showSuccess("Program Added");
      },
      error: (err: Error) => {
        this.toastService.showError();
        this.error = err
      }
    });
  }

  addExistingProgram(){
    if(this.existingProgramForm.invalid){ return; }
    const addProgramId: string = this.existingProgramForm.controls['programId'].value || "";
    this.programService.copyProgramToUserWorkouts(this.user.id, addProgramId)
      .subscribe({
        next: (key) => {
          if(key){
            this.toastService.showSuccess("Program Added");
          }
        },
        error: (err: Error) => {
          console.log(err);
          this.error = err;
        },
      })
  }

  addQuickSaveProgram(){
    if(!this.quickSaveProgram) { return; }
    this.programService.copyQuickSaveToUserWorkouts(this.user.id)
      .subscribe({
        next: () => {
          this.toastService.showSuccess("Program Added");
        },
        error: (err: Error) => {
          console.log(err);
          this.error = err;
        },
      })
  }

  removeSelectedWorkout() {
    if(this.selectedWorkout && this.selectedWorkout.id) {
      this.workoutService.removeWorkout(this.user.id, this.selectedWorkout.id)
        .pipe(finalize(() => {
          this.modalService.dismissAll();
        }))
        .subscribe({
          next: () => {
            this.selectedWorkout = null;
          },
          error: (err: Error) => {
            console.log(err)
            this.error = err;
          },
        })
    }
  }

  toggleWorkoutIsActive(workout: WorkoutId){
    if(!this.user){ return; }
    const active = !workout.active;
    this.workoutService.setWorkoutIsActive(this.user.id, workout.id, active)
    .pipe(switchMap(() => active ? this.userService.updateUserProgramDate(this.user.id) : of("")))
    .subscribe({
      error: (err: Error) => {
        this.error = err
        this.toastService.showError(`An error occurred ${active ? 'activating' : 'deactivating'} this program.`);
      }
    })
  }
}

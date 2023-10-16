import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { INITIAL_TASKS, Tasks } from '@app/@core/models/program/task.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';
import { Workout } from '@app/@core/models/program/workout.model';
import { ToastService } from '@app/@core/services/toast.service';
import { AuthService } from '@app/@shared/services/auth.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { ProgramService } from '@app/features/admin/services/programs.service';
import { TASKS_STRING, TasksService } from '@app/features/admin/services/tasks.service';
import { UserService } from '@app/features/admin/services/user.service';
import { WorkoutService } from '@app/features/program/services/workout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Observable, Subscription, finalize, first, forkJoin, map, of, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-user-program',
  templateUrl: './user-program.component.html',
  styleUrls: ['./user-program.component.css']
})
export class UserProgramComponent implements OnInit {
  @ViewChild('editWorkoutModal') editWorkoutModal: any;
  @ViewChild('editDayModal') editDayModal: any;
  @ViewChild('saveToProgramsModal') saveToProgramsModal: any;

  user: User;
  adminUser: User | null = null;
  currentUser$: Observable<User | null>;
  authUser$: Observable<User | null>;
  uid: string | null = null;
  wid: string | null = null;

  userSub: Subscription | undefined;
  tasksSub: Subscription;
  tasksList: Tasks[] = INITIAL_TASKS;
  
  workoutId: WorkoutId | null;
  workoutSub: Subscription;
  workout: Workout;
  workoutForm = this.fb.group({
    title: ["", [Validators.required]],
  });

  dayForm = this.fb.group({
    title: ["", Validators.required],
    image: ["", Validators.required],
  });

  error: Error;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private workoutService: WorkoutService,
    private programService: ProgramService,
    private tasksService: TasksService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastService: ToastService,
    private lsService: LocalStorageService
  ){
    this.authUser$ = this.authService.currentUser$.pipe(
      tap((user) => { if(user && !user.ADMIN){ this.router.navigateByUrl('/signin') } })
    );
  }

  ngOnInit(): void {
    this.getUser();
    this.fetchTasks();
    this.fetchWorkout();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
    this.workoutSub?.unsubscribe();
    this.tasksSub?.unsubscribe();
  }

  getUser() {
    this.userSub = this.route.paramMap
    .pipe(
      switchMap((params) => {
        const uid = params.get('uid');
        if(uid === null){
          this.router.navigateByUrl('/admin/users');
          return EMPTY;
        }
        return this.userService.selectedUser$
          .pipe(map((user) => ({ user, uid })))
      }),
      switchMap(({user, uid}) => {
        if(user === null){
          return this.userService.getUserById(uid)
            .pipe(first())
        } else {
          return of(user);
        }
      })
    )
    .subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (err: Error) => this.error = err
    });
  }

  fetchWorkout() {
    this.workoutSub = this.route.paramMap
    .pipe(
      switchMap((params) => {
        this.uid = params.get('uid');
        this.wid = params.get('pid');
        if(this.wid && this.uid){
          return forkJoin({
            workout: this.workoutService
              .getWorkout(this.uid, this.wid)
              .pipe(first()),
            workoutId: this.workoutService
              .getWorkoutId(this.uid, this.wid)
              .pipe(first())
          })
        } else {
          return of();
        }
      })
    )
    .subscribe({
      next: ({workout, workoutId}) => {
        this.workout = workout;
        this.workoutId = workoutId;
        this.patchWorkoutForm(workout);
      },
      error: (err) => {
        console.log(err)
        this.error = err;
        this.toastService.showError();
      }
    });
  }

  get f() { return this.workoutForm.controls; }

  fetchTasks(){
    const cashedTasks: Tasks[] = this.lsService.getParseData(TASKS_STRING);
    this.tasksSub = of(cashedTasks)
      .pipe(switchMap((tasks) => {
        if(tasks){
          return of(tasks);
        } else {
          return this.tasksService.getTasks();
        }
      }))
      .subscribe({  
        next: (tasks) => {
          this.tasksList = tasks;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  resetWorkoutForm() {
    this.workoutForm.patchValue({
      title: this.workout.title,
    });
  }

  patchWorkoutForm(workout: Workout) {
    this.workoutForm.patchValue({
      title: workout.title,
    });
  }

  openEditWorkoutModal() {
    this.modalService.open(this.editWorkoutModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openSaveToProgramsModal(){
    this.modalService.open(this.saveToProgramsModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openEditDayModal() {
    this.modalService.open(this.editDayModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  updateWorkoutTitle() {
    const title = this.f['title'].value;
    if(this.workout && this.workout.id && title){
      this.workoutService.updateWorkoutTitle(this.user.id, this.workout.id, title)
      .pipe(
        finalize(() => this.modalService.dismissAll())
      )
      .subscribe({
        next: () => {
          this.workout.title = title;
          this.toastService.showSuccess();
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
    }
  }

  handleSavePhase(phase: Phase) {
    this.workoutService.saveWorkoutWithPhaseUpdate(this.user.id, this.workout.id, phase)
    .subscribe({
      next: () => this.toastService.showSuccess(),
      error: (err: Error) => {
        this.error = err;
        this.toastService.showError();
      }
    })
  }

  quickSave(){
    this.programService.setQuickSave(this.workout)
    .subscribe({
      next: () => {
        this.toastService.showSuccess("Saved To QuickSave");
        this.modalService.dismissAll();
      },
      error: (err: Error) => {
        this.error = err;
        this.toastService.showError();
      }
    })
  }

  saveToPrograms(){
    this.programService.copyUserWorkoutToPrograms(this.user.id, this.workout.id)
      .subscribe({
        next: (key) => {
          if(key){
            this.toastService.showSuccess("Saved To Programs");
            this.modalService.dismissAll();
          }
        },
        error: (err: Error) => {
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  toggleWorkoutIsActive() {
    if(!this.workoutId){
      return;
    }
    const active = !this.workoutId.active;
    this.workoutService.setWorkoutIsActive(this.user.id, this.workoutId.id, active)
    .pipe(switchMap(() => active ? this.userService.updateUserProgramDate(this.user.id) : of("")))
    .subscribe({
      next: () => {
        if(this.workoutId){
          this.workoutId.active = active;
        }
      },
      error: (err: Error) => {
        this.error = err
        this.toastService.showError(`An error occurred ${active ? 'activating' : 'deactivating'} this program.`);
      }
    })
  }

}

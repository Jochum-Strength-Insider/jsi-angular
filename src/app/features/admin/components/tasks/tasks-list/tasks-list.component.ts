import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tasks } from '@app/@core/models/program/task.model';
import { ToastService } from '@app/@core/services/toast.service';
import { TasksService } from '@app/features/admin/services/tasks.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent {
  tasksSub: Subscription;
  searchSub: Subscription;
  search: string = "";
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  selectedTask: Tasks | null = null;
  taskForm: FormGroup;
  searchForm: FormGroup;
  edit: boolean = true;
  @ViewChild('addModal') addModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  error: Error;

  page: number = 1;
  pageSize: number = 10;

  constructor(
    private tasksService: TasksService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.fetchTasks();

    this.taskForm = this.fb.group({
      exercise: ["", [Validators.required, Validators.maxLength(200)]],
      link: ["", [Validators.required, Validators.maxLength(100)]],
    });

    this.searchForm = this.fb.group({
      search: ["", Validators.required],
    });

  }
  
  ngAfterViewInit(){   
    this.searchSub = this.searchForm.controls['search']
      .valueChanges.subscribe(val => { 
        this.filterTasks(val);
      });
    }
  
  filterTasks(value: string){
    this.filteredTasks = this.tasks.filter(task => task.e.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1 )
  }

  get f() { return this.taskForm.controls; }

  ngOnDestroy() {
    this.tasksSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  clearTaskForm(){
    this.taskForm.patchValue({
      exercise: "",
      link: "",
    });
  }

  resetTaskForm(){
    this.taskForm.patchValue({
      exercise: this.selectedTask ? this.selectedTask.e : "",
      link: this.selectedTask ? this.selectedTask.l : "",
    });
  }

  patchTaskForm(task: Tasks) {
    this.taskForm.patchValue({
      exercise: task.e,
      link: task.l,
    });
  }

  fetchTasks(): void {
    this.tasksSub = this.tasksService.getTasks()
    .subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasks(this.search);
      },
      error: (err) => console.log(err)
    });
  }

  openTasksModal(content: any, task: Tasks | null) {
    this.edit = true;
    if(task){
      this.selectedTask = task;
      this.patchTaskForm(task);
    } else {
      this.selectedTask = null;
      this.clearTaskForm();
      this.taskForm.patchValue({
        exercise: this.searchForm.controls['search'].value,
      });    
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openRemoveModal(task: Tasks){
    this.selectedTask = task;
    this.modalService.open(this.deleteModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  addTasks(){
    if(this.taskForm.invalid){
      return;
    }
    const task = new Tasks();
    task.e = this.f['exercise'].value;
    task.l = this.f['link'].value;

    this.tasksService.addTask(task)
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

  deleteSelectedTask() {
    if(this.selectedTask){
      this.tasksService.removeTask(this.selectedTask)
      .pipe(finalize(() => {
        this.modalService.dismissAll();
        this.selectedTask = null;
      }))
      .subscribe({
        error: (err: Error) => console.log(err),
      })
    }
  }

  updateTask(){
    if(this.selectedTask){
      this.selectedTask.e = this.f['exercise'].value;
      this.selectedTask.l = this.f['link'].value;

      this.tasksService.saveTask(this.selectedTask)
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

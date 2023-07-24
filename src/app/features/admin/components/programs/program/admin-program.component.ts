import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Folder } from '@app/@core/models/program/folder.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { Program } from '@app/@core/models/program/program.model';
import { INITIAL_TASKS, Tasks } from '@app/@core/models/program/task.model';
import { ToastService } from '@app/@core/services/toast.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { FOLDERS_STRING, ProgramService } from '@app/features/admin/services/programs.service.';
import { TASKS_STRING, TasksService } from '@app/features/admin/services/tasks.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize, first, of, switchMap, tap } from 'rxjs';

/*
ToDo:
Need to cache folders
*/

@Component({
  selector: 'app-admin-program',
  templateUrl: './admin-program.component.html',
  styleUrls: ['./admin-program.component.css']
})
export class AdminProgramComponent {
  programSub: Subscription;
  foldersSub: Subscription;
  tasksSub: Subscription;
  program: Program;
  programForm: FormGroup;
  dayForm: FormGroup;
  foldersList: Folder[] = [];
  tasksList: Tasks[] = INITIAL_TASKS;
  uid: string;

  @ViewChild('editProgramModal') editProgramModal: any;
  @ViewChild('editDayModal') editDayModal: any;
  error: Error;

  constructor(
    private programService: ProgramService,
    private tasksService: TasksService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private lsService: LocalStorageService
  ) {}

  ngOnInit(){
    this.programForm = this.fb.group({
      title: ["", [Validators.required]],
      folder: [""],
    });

    this.dayForm = this.fb.group({
      title: ["", Validators.required],
      image: ["", Validators.required],
    });

    this.programSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const pid = params.get('id');
          if(pid){
            return this.programService
              .getProgram(pid)
              .pipe(first());
          } else {
            return of();
          }
        })
      )
      .subscribe({
        next: (program) => {
          this.program = program;
          this.patchProgramForm(program);
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      });

      this.fetchFolders();
      this.fetchTasks();
  }

  get f() { return this.programForm.controls; }

  ngOnDestroy() {
    this.programSub?.unsubscribe();
    this.foldersSub?.unsubscribe();
    this.tasksSub?.unsubscribe();
  }

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
          this.foldersList = folders;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  resetProgramForm() {
    this.programForm.patchValue({
      title: this.program.title,
      folder: this.program?.parentFolderId || "",
    });
  }

  patchProgramForm(program: Program) {
    this.programForm.patchValue({
      title: program.title,
      folder: program?.parentFolderId || "",
    });
  }

  openEditProgramModal() {
    this.modalService.open(this.editProgramModal, {
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

  updateProgram() {
    const title = this.f['title'].value;
    const folderValue: string = this.f['folder'].value;
    const folder = folderValue.length > 0 ? folderValue : null;
    console.log('updateProgram', title, folder);
    if(this.program && this.program.id && title){
      this.programService.updateProgramFolderAndTitle(this.program.id, title, folder)
      .pipe(
        finalize(() => this.modalService.dismissAll())
      )
      .subscribe({
        next: () => {
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
    if(this.program.id){
      this.programService.saveProgramWithPhaseUpdate(this.program.id, phase)
      .subscribe({
        next: () => this.toastService.showSuccess(),
        error: (err: Error) => {
          this.error = err;
          this.toastService.showError();
        }
      })
    }
  }

  // <CreateProgramTable onSave={this.onSave} tasks={tasks} program={program} pid={pid} uid={uid} />
  // onSave = (phase, phaseUpdate) => {
  // const { firebase } = this.props;
  // const { pid } = this.state;

  // return firebase
  //     .program(pid)
  //     .child("instruction")
  //     .child(phase)
  //     .set(phaseUpdate)
  // }

  // Create Program Table
  //   <Tabs fill defaultActiveKey={phasesList[0]} className="dark-tab">
  //   {phasesList.map((key, index) => {
  //      const { completed, ...days } = tablesList[key];
  //      const phaseTitle = key.charAt(0).toUpperCase() + key.substring(1);
  //      return (
  //         <Tab eventKey={key} title={phaseTitle} key={key}>
  //            <ExpandableTable onSave={onSave} tasks={tasks} days={days} phase={key} key={key} pid={pid} showTracking={false} />
  //         </Tab>
  //      )
  //   })}
  // </Tabs>

}

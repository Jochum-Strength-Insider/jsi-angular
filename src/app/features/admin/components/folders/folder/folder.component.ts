import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Folder } from '@app/@core/models/program/folder.model';
import { ProgramId } from '@app/@core/models/program/program-id.model';
import { ToastService } from '@app/@core/services/toast.service';
import { ProgramService } from '@app/features/admin/services/programs.service.';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize, forkJoin, map, of, switchMap, tap } from 'rxjs';

/*
ToDo:
Break out into components
cache Folders
Move pagination into reusable component
Add date added
Add headers and basic sort
*/

@Component({
  selector: 'app-folders',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent {
  folderId: string | null = null;
  folder: Folder;
  programsList: ProgramId[] = [];
  filteredPrograms: ProgramId[] = [];

  uncategorizedPrograms: ProgramId[] = [];
  selectedProgram: ProgramId | null = null;
  state: string;

  programsListSub: Subscription;
  uncategorizedProgramsSub: Subscription;
  searchSub: Subscription;
  search: string = "";

  searchForm: FormGroup;
  folderForm: FormGroup;
  existingProgramForm: FormGroup;
  programForm: FormGroup;
  
  @ViewChild('editFolder') editFolder: any;
  @ViewChild('addProgramModal') addProgramModal: any;
  @ViewChild('deleteProgramModal') deleteProgramModal: any;

  error: Error;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private programService: ProgramService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(){
    this.folderForm = this.fb.group({
      title: ["", [Validators.required]],
    });

    this.searchForm = this.fb.group({
      search: ["", Validators.required],
    });

    this.programForm = this.fb.group({
      title: ["", Validators.required],
    });

    this.existingProgramForm = this.fb.group({
      programId: ["", Validators.required]
    });
    
    // this might be a convoluted approach...
    this.programsListSub = this.route.data
    .pipe(
      switchMap((data) => {
        const state = data['folder'];
        if(state){
          this.state = state;
          return of({state, param: null});
        } else {
          return this.route.paramMap
            .pipe(map((params) => ({ state: null, param: params.get('id') })))
        }
      }),
      switchMap((folderId) => {
        if(folderId.param){
          return this.programService.getFolder(folderId.param)
            .pipe(
              tap((folder) => {
                if(folder) { 
                  this.folder = folder
                  this.patchFolderForm(folder);
                } else {
                  this.router.navigateByUrl('admin/folders/list')
                }
              }),
              map((folder) => ({ state: null, param: folder ? folder.id : null }))
            )
        }
        return of(folderId);
      }),
      switchMap((folderId) => {
        if(folderId.state === "all") {
          return this.programService.getProgramIds();
        } 
        if(folderId.state === 'uncategorized') {
          return this.programService.getProgramIdsByFolder(null);
        }
        if(folderId.param){
          this.folderId = folderId.param;
          return this.programService.getProgramIdsByFolder(folderId.param);
        }
        return of([]);
      })
    )
    .subscribe({
      next: results => {
        this.programsList = results;
        this.filterPrograms(this.search);
      },
      error: (err: Error) => {
        console.log(err)
        this.error = err;
      },
    });

    this.uncategorizedProgramsSub = 
      this.programsListSub = this.route.data
      .pipe(
        switchMap((data) => {
          const state = data['folder'];
          if(!state){
            return this.programService.getProgramIdsByFolder(null);
          } else {
            return of([]);
          }
        })
      ).subscribe({
        next: results => {
          this.uncategorizedPrograms = results;
        },
        error: (err: Error) => {
          console.log(err)
          this.error = err;
        },
      })
  }
  
  ngAfterViewInit(){   
    this.searchSub = this.searchForm.controls['search']
      .valueChanges.subscribe(val => { 
        this.search = val;
        this.filterPrograms(val);
      });
  }

  filterPrograms(value: string){
    this.filteredPrograms = this.programsList.filter(program => program.title.toLowerCase().indexOf(value.toLowerCase()) > -1 )
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.programsListSub?.unsubscribe();
    this.uncategorizedProgramsSub?.unsubscribe();
  }

  clearFolderForm(){
    this.folderForm.patchValue({
      title: "",
    });
  }

  resetFolderForm(){
    this.folderForm.patchValue({
      title: this.folder.title,
    });
  }

  patchFolderForm(folder: Folder) {
    this.folderForm.patchValue({
      title: folder.title,
    });
  }

  searchPrograms(search: string){
    this.filteredPrograms = this.programsList.filter((program) => program.title.includes(search))
  }

  openFoldersModal(content: any) {
    if(!this.state){
      this.modalService.open(content, {
        size: 'lg',
        centered: true,
        backdrop: true,
      });
    }
  }

  openAddProgramModal(content: any, program: ProgramId | null) {    
    this.programForm.patchValue({
      title: this.searchForm.controls['search'].value
    });    

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openRemoveModal(program: ProgramId){
    this.selectedProgram = program;
    this.modalService.open(this.deleteProgramModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  addProgram() {
    if(this.programForm.invalid){
      return;
    }
    const title: string = this.programForm.controls['title'].value;
    this.programService.createProgram(title, this.folderId)
    .pipe(finalize(() => {
      this.modalService.dismissAll();
    }))
    .subscribe({
      next: () => {
        this.toastService.showSuccess();
        console.log('add program')
      },
      error: (err: Error) => {
        this.toastService.showError();
        this.error = err
      }
    });
  }

  addExistingProgram(){
    if(this.existingProgramForm.invalid || !this.folderId){
      return;
    }
    const addProgramId: string = this.existingProgramForm.controls['programId'].value;
    this.programService.addProgramToFolder(addProgramId, this.folderId)
    .pipe(finalize(() => {
      this.modalService.dismissAll();
    }))
    .subscribe({
      next: () => {
        this.toastService.showSuccess();
        console.log('add existing program')
      },
      error: (err: Error) => {
        console.log(err);
        this.error = err;
      },
    })
  }

  removeSelectedProgram() {
    if(this.selectedProgram && this.selectedProgram.id){
      this.programService.removeProgram(this.selectedProgram.id)
      .pipe(finalize(() => {
        this.modalService.dismissAll();
      }))
      .subscribe({
        next: () => {
          console.log('remove');
          this.selectedProgram = null;
        },
        error: (err: Error) => {
          console.log(err)
          this.error = err;
        },
      })
    }
  }

  updateFolder(){
    if(this.folder){
      this.folder.title = this.folderForm.controls['title'].value;
      this.programService.saveFolder(this.folder)
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

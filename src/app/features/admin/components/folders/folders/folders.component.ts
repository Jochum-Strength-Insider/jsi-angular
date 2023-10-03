import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Folder } from '@app/@core/models/program/folder.model';
import { ToastService } from '@app/@core/services/toast.service';
import { ProgramService } from '@app/features/admin/services/programs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize } from 'rxjs';


@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent {
  foldersSub: Subscription;
  searchSub: Subscription;

  folders: Folder[] = [];
  filteredFolders: Folder[] = [];
  selectedFolder: Folder | null = null;

  folderForm: FormGroup;
  searchForm: FormGroup;
  search: string = "";

  edit: boolean = true;
  @ViewChild('addModal') addModal: any;
  @ViewChild('deleteModal') deleteModal: any;

  error: Error;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private programService: ProgramService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.fetchFolders();

    this.folderForm = this.fb.group({
      title: ["", [Validators.required, Validators.maxLength(200)]],
    });

    this.searchForm = this.fb.group({
      search: ["", Validators.required],
    });
  }
  
  ngAfterViewInit(){   
    this.searchSub = this.searchForm.controls['search']
      .valueChanges.subscribe(val => {
        this.search = val;
        this.filterFolders(val);
      });
    }
    
  filterFolders(value: string){
    this.filteredFolders = this.folders.filter(folder => folder.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1 )
  }

  get f() { return this.folderForm.controls; }

  ngOnDestroy() {
    this.foldersSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  clearFolderForm(){
    this.folderForm.patchValue({
      title: "",
    });
  }

  resetFolderForm(){
    this.folderForm.patchValue({
      title: this.selectedFolder ? this.selectedFolder.title : "",
    });
  }

  patchFolderForm(folder: Folder) {
    this.folderForm.patchValue({
      title: folder.title,
    });
  }

  fetchFolders(): void {
    this.foldersSub = this.programService.getFolders()
    .subscribe({
      next: (folders) => {
        this.folders = folders;
        this.filterFolders(this.search);
      },
      error: (err) => {
        console.log(err)
        this.error = err;
      }
    });
  }

  searchFolders(search: string){
    this.filteredFolders = this.folders.filter((folder) => folder.title.includes(search))
  }

  openFoldersModal(content: any, folder: Folder | null) {
    this.edit = true;
    if(folder){
      this.selectedFolder = folder;
      this.patchFolderForm(folder);
    } else {
      this.selectedFolder = null;
      this.clearFolderForm();
      this.folderForm.patchValue({
        title: this.searchForm.controls['search'].value
      });    
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openRemoveModal(folder: Folder){
    this.selectedFolder = folder;
    this.modalService.open(this.deleteModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  addFolder(){
    if(this.folderForm.invalid){
      return;
    }
    const folder = new Folder();
    folder.title = this.f['title'].value;

    this.programService.addFolder(folder)
    .pipe(finalize(() => {
      this.modalService.dismissAll();
    }))
    .subscribe({
      next: () => {
        this.toastService.showSuccess();
      },
      error: (err: Error) => {
        this.toastService.showError();
        this.error = err;
        console.log(err);
      }
    });
  }

  deleteSelectedFolder() {
    if(this.selectedFolder){
      this.programService.removeFolder(this.selectedFolder)
      .pipe(finalize(() => {
        this.modalService.dismissAll();
      }))
      .subscribe({
        next: () => {
          this.selectedFolder = null;
        },
        error: (err: Error) => {
          this.toastService.showError();
          this.error = err;
          console.log(err);
        }
      })
    }
  }

  updateFolder(){
    if(this.selectedFolder){
      this.selectedFolder.title = this.f['title'].value;

      this.programService.saveFolder(this.selectedFolder)
      .subscribe({
        next: () => {
          this.toastService.showSuccess();
        },
        error: (err: Error) => {
          this.toastService.showError();
          this.error = err;
          console.log(err);
        }
      });
    }
  }
}

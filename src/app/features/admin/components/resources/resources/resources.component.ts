import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Resource } from '@app/@core/models/resources/resources.model';
import { ToastService } from '@app/@core/services/toast.service';
import { CodesService } from '@app/@shared/services/codes.service';
import { ResourcesService } from '@app/features/resources/services/resources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-admin-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class AdminResourcesComponent implements OnInit, AfterViewInit, OnDestroy {
  resourcesSub: Subscription;
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  selectedResource: Resource | null = null;
  resourceForm: FormGroup = this.fb.group({
    title: ["", Validators.required],
    link: ["", Validators.required],
    description: ["", Validators.required],
  });

  searchSub: Subscription;
  search: string = "";
  searchForm: FormGroup = this.fb.group({
    search: ["", Validators.required],
  });
  hoverStates: boolean[] = [];
  edit: boolean = true;

  @ViewChild('addModal') addModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  error: Error;

  page: number = 1;
  pageSize: number = 10;

  constructor(
    private resourcesService: ResourcesService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(){
    this.fetchResources();
  }

  ngAfterViewInit(){   
    this.searchSub = this.searchForm.controls['search']
      .valueChanges.subscribe(val => {
        this.search = val;
        this.filterResources(val);
      });
  }

  filterResources(value: string){
    this.filteredResources = this.resources.filter(resource => resource.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1 )
  }

  get f() { return this.resourceForm.controls; }

  ngOnDestroy(){
    this.resourcesSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  clearResourceForm(){
    this.resourceForm.patchValue({
      title: "",
      link: "",
      description: "",
    });
  }

  resetResourceForm(){
    this.resourceForm.patchValue({
      title: this.selectedResource ? this.selectedResource.title : "",
      link: this.selectedResource ? this.selectedResource.link : "",
      description: this.selectedResource ? this.selectedResource.description : "",
    });
  }
  
  patchResourceForm(resource: Resource) {
    this.resourceForm.patchValue({
      title: resource.title,
      link: resource.link,
      description: resource.description,
    });
  }

  fetchResources(): void {
    this.resourcesSub = this.resourcesService.getResources()
    .subscribe({
      next: (resources) => {
        this.resources = resources;
        this.filterResources(this.search);
      },
      error: (err: Error) => {
        console.log(err)
        this.error = err;
      }
    })
  }

  openResourceModal(content: any, resource: Resource | null) {
    this.edit = true;
    if(resource){
      this.selectedResource = resource;
      this.patchResourceForm(resource);
    } else {
      this.selectedResource = null;
      this.clearResourceForm();
      this.resourceForm.patchValue({
        title: this.searchForm.controls['search'].value,
      });  
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openRemoveModal(resource: Resource){
    this.selectedResource = resource;
    this.modalService.open(this.deleteModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  addResource(){
    const resource = new Resource();
    resource.title = this.f['title'].value;
    resource.link = this.f['link'].value;
    resource.description = this.f['description'].value;

    this.resourcesService.addResource(resource)
    .pipe(finalize(() => this.modalService.dismissAll()))
    .subscribe({
      next: () => {
        this.toastService.showSuccess("Resource Added");
      },
      error: (error: Error) => {
        this.toastService.showError();
        this.error = error
      }
    });
  }

  toggleResourceIsActive(resource: Resource){
    this.resourcesService.toggleResourceIsActive(resource)
    .subscribe({
      error: (err: Error) => console.log(err)
    })
  }

  deleteSelectedResource() {
    if(this.selectedResource){
      this.resourcesService.removeResource(this.selectedResource)
      .pipe(finalize(() => {
        this.modalService.dismissAll();
        this.selectedResource = null;
      }))
      .subscribe({
        next: () => this.toastService.showSuccess("Resource Deleted"),
        error: (err: Error) => {
          this.error = err;
          this.toastService.showError();
        },
      })
    }
  }

  updateResource(){
    if(this.selectedResource){
      this.selectedResource.title = this.f['title'].value;
      this.selectedResource.link = this.f['link'].value;
      this.selectedResource.description = this.f['description'].value;

      this.resourcesService.saveResource(this.selectedResource)
      .pipe(finalize(() => this.modalService.dismissAll()))
      .subscribe({
        next: () => {
          this.toastService.showSuccess("Resource Updated");
        },
        error: (error: Error) => {
          this.toastService.showError();
          this.error = error
        }
      });
    }
  }
}

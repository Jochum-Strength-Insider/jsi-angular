import { Component, OnDestroy, OnInit } from '@angular/core';
import { Resource } from '@app/@core/models/resources/resources.model';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../../services/resources.service';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';


@Component({
  selector: 'app-resources-container',
  templateUrl: './resources-container.component.html',
  styleUrls: ['./resources-container.component.css'],
})
export class ResourcesContainerComponent implements OnInit, OnDestroy {
  resourcesSub: Subscription;
  resources: Resource[] = [];
  
  constructor(
    private resourcesService: ResourcesService,
    private errorService: ErrorHandlingService
  ) {}

  ngOnInit(){
    this.fetchResources();
  }

  ngOnDestroy(): void {
    this.resourcesSub?.unsubscribe();
  }

  fetchResources(): void {
    this.resourcesSub = this.resourcesService.getActiveResources()
    .subscribe({
      next: (resources) => {
        this.resources = resources;
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Get Resources',
          'An error occurred while trying to retreive resources. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    })
  }
}

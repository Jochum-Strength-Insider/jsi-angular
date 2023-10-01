import { Component, OnDestroy, OnInit } from '@angular/core';
import { Resource } from '@app/@core/models/resources/resources.model';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../../services/resources.service';


@Component({
  selector: 'app-resources-container',
  templateUrl: './resources-container.component.html',
  styleUrls: ['./resources-container.component.css'],
})
export class ResourcesContainerComponent implements OnInit, OnDestroy {
  resourcesSub: Subscription;
  resources: Resource[] = [];
  error: Error;
  
  constructor(
    private resourcesService: ResourcesService,
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
      error: (err: Error) => {
        this.error = err;
      }
    })
  }
}

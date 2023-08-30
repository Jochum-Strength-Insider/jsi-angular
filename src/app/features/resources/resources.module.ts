import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesContainerComponent } from './components/resources-container/resources-container.component';
import { ResourcesPageComponent } from './pages/resources-page/resources-page.component';
import { SharedModule } from '@app/@shared/shared.module';


@NgModule({
  declarations: [
    ResourcesContainerComponent,
    ResourcesPageComponent
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    SharedModule
  ]
})
export class ResourcesModule { }

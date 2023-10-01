import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { MessagesContainerComponent } from './components/messages-container/messages-container.component';
import { MessagesListComponent } from './components/messages-list/messages-list.component';
import { MessagesItemComponent } from './components/messages-item/messages-item.component';
import { MessagesFormComponent } from './components/messages-form/messages-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminMessagesContainerComponent } from './components/admin-messages-container/admin-messages-container.component';


@NgModule({
  declarations: [
    MessagesComponent,
    MessagesPageComponent,
    MessagesContainerComponent,
    AdminMessagesContainerComponent,
    MessagesListComponent,
    MessagesItemComponent,
    MessagesFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagesRoutingModule
  ],
  exports: [
    AdminMessagesContainerComponent
  ]
})
export class MessagesModule { }

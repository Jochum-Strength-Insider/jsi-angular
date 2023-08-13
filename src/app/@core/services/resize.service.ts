import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/* This service is used to track events that should trigger element resizing across the application */

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private adminPanelSub = new Subject<boolean>();
  readonly adminPanel$ = this.adminPanelSub.asObservable();

  constructor() { }

  public setAdminPanelOpen(open: boolean){
    this.adminPanelSub.next(open);
  }
}

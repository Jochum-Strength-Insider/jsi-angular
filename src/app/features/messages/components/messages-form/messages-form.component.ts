import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages-form',
  templateUrl: './messages-form.component.html',
  styleUrls: ['./messages-form.component.css']
})
export class MessagesFormComponent implements OnDestroy {
  @Output() sendMessageClicked = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput: ElementRef;
  messageForm: FormGroup;
  messageChangesSub?: Subscription;

  constructor(
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: '' 
    });
  }

  ngAfterViewInit() {
    this.messageChangesSub = this.message?.valueChanges
      .subscribe(() => {
        if(this.messageInput?.nativeElement){
          this.messageInput.nativeElement.style.cssText = 'height: auto; padding: 6px';
          this.messageInput.nativeElement.style.cssText = 'height:' + this.messageInput.nativeElement.scrollHeight + 'px';
        }
    });
  }

  ngOnDestroy(){
    this.messageChangesSub?.unsubscribe();
  }

  get message() {
    return this.messageForm.get('message');
  }

  sendMessage(){
    const message = this.message?.value ?? '';
    this.sendMessageClicked.emit(message);
    this.messageForm.patchValue({message: ''});
  }

  onEnterKeydown(e: any) {
    e.preventDefault();
  }
}

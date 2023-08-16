import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.css']
})
export class UserImageComponent {
  @Output() fileUploadClicked = new EventEmitter<File>();
  @Output() removeImageClicked = new EventEmitter();

  @Input() title: string;
  @Input() image: string | null;
  @Input() uploading: boolean = false;

  file: File | null = null;
  touched: boolean = false;
  isInvalid: boolean = false;
  invalidMessage: string = "";

  constructor(
    private modalService: NgbModal
  ) {}

  handleOpenModal(content: any){
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0];
      this.touched = true;
      if (file.size > 3000000) {
        this.isInvalid = true;
        this.invalidMessage = "File must be smaller than 3mb";
        return;
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.isInvalid = true;
        this.invalidMessage = "File must be a .png or .jpeg";
        return;
      }
      this.isInvalid = false;
      this.invalidMessage = "";
      this.file = file;
    } else {
      this.touched = false;
      this.isInvalid = false;
      this.invalidMessage = "";
      this.file = null;
    }
  }

  uploadFile(){
    if(!this.file) { return; }
    this.fileUploadClicked.emit(this.file);
  }

  removeImg(){
    this.removeImageClicked.emit();
  }
}
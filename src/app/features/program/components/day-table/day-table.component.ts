import { Component, Input, OnInit } from '@angular/core';
import { Day } from '@app/@core/models/program/day.model';
import { Exercise } from '@app/@core/models/program/exercise.model';
import { ToastService } from '@app/@core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgramService } from '../../services/program.service';
import { YoutubeEmbedComponent } from '../youtube-embed/youtube-embed.component';

@Component({
  selector: 'app-day-table',
  templateUrl: './day-table.component.html',
  styleUrls: ['./day-table.component.css']
})
export class DayTableComponent implements OnInit {
  @Input() day: Day;
  @Input() programKey: string;
  @Input() uid: string;
  @Input() phaseTitle: string;
  error: Error | null = null;

  constructor(
    private modalService: NgbModal,
    private service: ProgramService,
    private toastService: ToastService
  ) {}

  ngOnInit(){}

  handleShowModal(exercise: Exercise) {
    const modalRef = this.modalService.open(YoutubeEmbedComponent,
      {
        size: 'lg',
        centered: true,
        backdrop: true,
      });
    
    modalRef.componentInstance.videoId = exercise.Link;
    modalRef.componentInstance.title = exercise.Description
  }

  handleSaveTracking() {
    this.service.saveWorkoutTracking(this.uid, this.programKey, this.phaseTitle, this.day)
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
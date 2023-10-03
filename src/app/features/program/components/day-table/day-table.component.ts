import { Component, Input, OnInit } from '@angular/core';
import { Day } from '@app/@core/models/program/day.model';
import { Exercise } from '@app/@core/models/program/exercise.model';
import { ToastService } from '@app/@core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YoutubeEmbedComponent } from '../youtube-embed/youtube-embed.component';
import { WorkoutService } from '../../services/workout.service';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';

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

  constructor(
    private modalService: NgbModal,
    private service: WorkoutService,
    private toastService: ToastService,
    private errorService: ErrorHandlingService
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
      error: (err) => {
        this.errorService.generateError(
          err,
          'Save Tracking',
          'An error occurred while trying to save exercise tracking information. Please try again and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    });
  }
}
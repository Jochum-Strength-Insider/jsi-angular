import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { ErrorModel } from '../models/error.model';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(
    private toastService: ToastService
  ) {}

  handleError(error: ErrorModel) {
    this.toastService.showError(error.clientMessage);
  }

  generateError(err: any, operation: string, clientMessage: string): Observable<ErrorModel> {
    const error: ErrorModel = {
      message: `${operation} failed: ${err.message}`,
      clientMessage: clientMessage,
      statusCode: err.status,
    };
    this.handleError(error);
    return throwError(() => error);
  }
}

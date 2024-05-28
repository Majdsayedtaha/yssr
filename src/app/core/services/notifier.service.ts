import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { NotifierComponent } from '../components/notifier/notifier.component';
import { DirectionService } from './direction.service';
@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private _snakeBar: MatSnackBar, private _direction: DirectionService) {}

  showNotification(displayedMessage: string, status: 'warning' | 'error' | 'info' = 'warning') {
    this._snakeBar.openFromComponent(NotifierComponent, {
      data: {
        message: displayedMessage,
        warn: status == 'warning',
      },
      duration: 5000,
      horizontalPosition: this._direction.getDirection() !== 'ltr' ? 'left' : 'right',
      verticalPosition: 'top',
      panelClass: [status + '-snackbar'],
    });
  }

  showNormalSnack(displayedMessage: string, position: MatSnackBarHorizontalPosition = 'end') {
    this._snakeBar.openFromComponent(NotifierComponent, {
      data: {
        message: displayedMessage,
        normal: true,
      },
      duration: 5000,
      horizontalPosition: position,
      direction: this._direction.getDirection(),
      panelClass: ['normal-snackbar'],
    });
  }

  dismiss() {
    this._snakeBar.dismiss();
  }
}

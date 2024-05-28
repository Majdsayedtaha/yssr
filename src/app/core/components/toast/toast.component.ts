import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { timer, map, takeWhile, Subscription } from 'rxjs';
export interface IToastData {
  firstButtonContent: string;
  secondButtonContent: string;
  messageContent: string;
  svgIcon: string;
  centralize: boolean;
  hideTranslate?: boolean;
}
@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnDestroy {
  sub?: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public toastData: IToastData, public dialogRef: MatDialogRef<ToastComponent>) {}

  ngOnInit(): void {
    if (this.toastData.hideTranslate) {
      this.sub = timer(0, 1000)
        .pipe(
          map(n => 5 - n),
          takeWhile(n => n >= 0)
        )
        .subscribe({
          complete: () => {
            this.dialogRef.close();
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

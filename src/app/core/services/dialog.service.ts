import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ToastComponent } from '../components/toast/toast.component';
import { TranslateService } from '@ngx-translate/core';
@Injectable({ providedIn: 'root' })
export class DialogService {
  size = {
    s: { width: '36vw', height: '42vh' },
    m: { width: '30vw', height: '60vh' },
    l: { width: '50vw', height: '90vh' },
    xl: { width: '90vw', height: '90vh' },
  };

  constructor(private dialog: MatDialog, private _translateService: TranslateService) {}

  openDialog(
    component: ComponentType<any> | TemplateRef<any>,
    options: {
      width?: string;
      height?: string;
      size?: 's' | 'm' | 'l' | 'xl';
      panelClass?: string;
      backdropClass?: string;
      data?: any;
      disableClose?: boolean;
    } = {
      width: '100%',
      size: 'l',
      panelClass: 'custom-dialog-container',
      // backdropClass: 'backdropBackground',
    }
  ) {
    return this.dialog
      .open(component, {
        direction: this._translateService.currentLang === 'ar' ? 'rtl' : 'ltr',
        ...options,
        width: options?.size && this.size[options.size]?.width,
        height: 'max-content',
        scrollStrategy: new NoopScrollStrategy(),
        disableClose: options.disableClose,
      })
      .afterClosed()
      .pipe(take(1));
  }

  successNotify(
    message: string,
    svgIcon?: string,
    firstButtonContent?: string,
    secondButtonContent?: string,
    hideTranslate?: boolean
  ) {
    return this.openDialog(ToastComponent, {
      width: '100%',
      size: 's',
      panelClass: 'custom-dialog-container',
      //  backdropClass: 'backdropBackground',
      data: {
        messageContent: message,
        svgIcon: !svgIcon ? 'laptop-toast' : svgIcon,
        firstButtonContent: firstButtonContent,
        secondButtonContent: secondButtonContent,
        hideTranslate: hideTranslate,
      },
    });
  }
  
  closeAll(){
    this.dialog.closeAll()
  }
}

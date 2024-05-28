import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { HousingService } from '../../../services/housing.service';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of, switchMap } from 'rxjs';
import { IHousingStatistics } from '../../../models';
import { DialogHousingWorkerFormComponent } from '../../toaster/dialog-housing-worker-form/dialog-housing-worker-form.component';
import { DialogService } from 'src/app/core/services/dialog.service';

@UntilDestroy()
@Component({
  selector: 'app-housing-more-actions-cell',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="filter-menu">
      <!-- Detail -->
      <button mat-menu-item (click)="displaySide()">
        <mat-icon color="primary" class="menu-item" svgIcon="housing-p"></mat-icon>
        <span>{{ 'view_details' | translate }}</span>
      </button>
      <!-- Edit -->
      <button mat-menu-item (click)="edit()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'label.housing.update' | translate }}</span>
      </button>
      <!-- Delete -->
      <button mat-menu-item (click)="delete()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'label.housing.delete' | translate }}</span>
      </button>
      <!-- Add Worker -->
      <button mat-menu-item (click)="openAddDialog()" authorization [roleValue]="roleWorker" [authName]="authCanAdd">
        <mat-icon color="primary" class="menu-item" svgIcon="personal-data"></mat-icon>
        <span>{{ 'label.worker.add' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      ::ng-deep {
        [dir='rtl'] .mat-mdc-menu-item {
          flex-direction: row-reverse !important;
        }
        .mat-mdc-menu-item {
          min-height: 40px !important;
          font-size: 14px !important;
          border-bottom: 1px dashed var(--light-active-accent-color) !important;
          &:last-child {
            border-bottom: none !important;
          }
        }
        .mat-mdc-menu-item.mdc-list-item {
          .mat-icon path {
            fill: var(--primary-color) !important;
          }
        }
        .mat-mdc-menu-content {
          padding: 0 !important;
        }
      }
      .more-btn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        padding: 3px;
        padding-top: 4px;
        .mat-icon {
          scale: 0.7;
        }
      }
      .menu-item {
        width: 16px;
        height: 16px;
        font-size: 14px;
      }
    `,
  ],
})
export class HousingMoreActionsCellComponent extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.Housing;
  roleWorker = IRoleEnum.Worker;

  constructor(
    private _router: Router,
    private _toast: DialogService,
    private _housingService: HousingService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  edit() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.housing}/update/${this.params.data.id}`);
  }

  delete() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_housing',
      firstButtonContent: 'back_table',
      secondButtonContent: 'yes_surely',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, {
        data: toastData,
      })
      .pipe(
        untilDestroyed(this),
        switchMap(res => (res ? this._housingService.deleteHousing(this.params.data.id) : of(null)))
      )
      .subscribe(res => {
        if (res) {
          this._housingService.setStatistics(res?.data as IHousingStatistics);
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  openAddDialog() {
    this._toast.openDialog(DialogHousingWorkerFormComponent, { width: 'fit-content', });
  }

  displaySide() {
    this._housingService.setHousingIdSubject(this.params.data.id);
  }
}

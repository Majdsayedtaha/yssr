import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { WorkerService } from '../../services/worker.service';
import { Router } from '@angular/router';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
import { IWorkerStatistics } from '../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogService } from 'src/app/core/services/dialog.service';
import { environment } from '@environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-worker-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="filter-menu">
      <button mat-menu-item (click)="displaySide()">
        <mat-icon color="primary" class="menu-item" svgIcon="personal-data"></mat-icon>
        <span>{{ 'options.worker.detail' | translate }}</span>
      </button>
      <button mat-menu-item (click)="edit()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'options.worker.edit' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteWorker()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'options.worker.delete' | translate }}</span>
      </button>
      <button mat-menu-item (click)="toggleBlocked()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="block-customer"></mat-icon>
        <ng-container *ngIf="!params.data.isBlocked; else elseUnBlocked">
          <span>{{ 'options.worker.block' | translate }}</span>
        </ng-container>
        <ng-template #elseUnBlocked>
          <span>{{ 'options.worker.unblock' | translate }}</span>
        </ng-template>
      </button>
      <!-- <button mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="list-numbers"></mat-icon>
        <span>{{ 'options.worker.rent_record' | translate }}</span>
      </button> -->
      <a
        style="color: inherit; font-size: inherit; font-weight: inherit;"
        [href]="baseUrl + '/File/WorkerInfo/' + params.data.id"
        download
        mat-menu-item>
        <mat-icon color="primary" class="menu-item" svgIcon="print"></mat-icon>
        <span>{{ 'options.worker.print' | translate }}</span>
      </a>
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
export class WorkersMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.Worker;
  baseUrl = environment.baseURL;

  constructor(
    private _router: Router,
    private _toast: DialogService,
    private _workerService: WorkerService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  edit() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.worker}/update/${this.params.data.id}`);
  }

  deleteWorker() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_worker',
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
        switchMap(res => (res ? this._workerService.deleteWorker(this.params.data.id) : of(null)))
      )
      .subscribe(res => {
        if (res) {
          this._workerService.setStatistics(res?.data as IWorkerStatistics);
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }

  toggleBlocked() {
    const toastData: IToastData = {
      messageContent: this.params.data.isBlocked ? 'you_want_to_unblock_worker' : 'you_want_to_block_worker',
      firstButtonContent: 'cancel',
      secondButtonContent: 'yes',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, {
        data: toastData,
      })
      .subscribe((res: any) => {
        if (res)
          this._workerService.toggleWorkerBlock(this.params.data.id).subscribe(res => {
            this.params.data.isBlocked = !this.params.data.isBlocked;
            this.params.api.refreshCells({ columns: ['isBlocked'] });
            this._workerService.setStatistics(res?.data as IWorkerStatistics);
          });
      });
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  displaySide() {
    this._workerService.setWorkerIdSubject(this.params.data.id);
  }
}

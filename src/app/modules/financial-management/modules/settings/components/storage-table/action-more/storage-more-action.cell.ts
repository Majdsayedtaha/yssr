import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DialogActionStorageComponent } from '../dialog-action/dialog-action-storage/dialog-action-storage.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StoreService } from '../../../services/store.service';
@UntilDestroy()
@Component({
  selector: 'app-storage-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="updateStore()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'table.storage.update' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteStore()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'table.storage.delete' | translate }}</span>
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
export class StorageMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _storeService: StoreService
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  updateStore() {
    const dialogRef = this.matDialog.openDialog(DialogActionStorageComponent, {
      data: { data: this.params.data, update: true },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          const data = {
            id: this.params.data.id,
            nameEn: res.nameEn,
            nameAr: res.nameAr,
          };
          this.params.api.applyTransaction({ update: [data] });
          this.matDialog.closeAll();
        }
      },
    });
  }

  deleteStore() {
    this._storeService
      .deleteStore(this.params.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
      });
  }
}

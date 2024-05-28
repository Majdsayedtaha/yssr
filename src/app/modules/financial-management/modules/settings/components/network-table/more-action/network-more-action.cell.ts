import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkService } from '../../../services/network.service';
import { DialogNetworkComponent } from '../dialog-network/dialog-network.component';
@UntilDestroy()
@Component({
  selector: 'app-network-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="updateNetwork()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'table.network.update' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteNetwork()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'table.network.delete' | translate }}</span>
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
export class NetworkMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _networkService: NetworkService
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  updateNetwork() {
    const dialogRef = this.matDialog.openDialog(DialogNetworkComponent, {
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

  deleteNetwork() {
    this._networkService
      .deleteNetwork(this.params.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
      });
  }
}

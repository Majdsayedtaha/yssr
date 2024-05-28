import { of, switchMap } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ContractService } from '../../../services/contract.service';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { DialogExtensionContractComponent } from '../toaster/dialog-extension/dialog-extension-contract.component';
import { DialogService } from 'src/app/core/services/dialog.service';

@UntilDestroy()
@Component({
  selector: 'app-contracts-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menuItemList" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menuItemList="matMenu" class="more-actions-menu" >
      <button mat-menu-item (click)="addExtension()">
        <span>{{ 'contract_extension' | translate }}</span>
      </button>
      <button mat-menu-item *ngIf="canEndManually && !params.data.isEnd" (click)="confirmEnding(params.data.id)">
        <span>{{ 'contract_finish' | translate }}</span>
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
        padding: 2px;
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
export class WarrantyMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  canEndManually: boolean = true;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _contractService: ContractService,
    private _toast: DialogService,
  ) {
    super(injector);
    this.canEndManually = this._contractService._optionContractEnding.value;
    this._contractService._optionContractEnding.subscribe(value => this.canEndManually = value);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  confirmEnding(contractId: string) {
    const toastData: IToastData = {
      messageContent: 'you_want_to_end_contract',
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
        switchMap(res => {
          if (res) {
            return this._contractService.finishWarranty(this.params.data.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(res => {
        if (res) {
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }

  addExtension() {
    const dialogRef = this._toast.openDialog(DialogExtensionContractComponent, {
      disableClose: false, data: { warrantyDate: this.params.data.warrantyDate, contractId: this.params.data.id },
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          const rowData = this.params.data;
          rowData['warrantyDate'] = res;
          this.params.api.applyTransaction({ update: [rowData] });
        }
      },
    });
  }
}

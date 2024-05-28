import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { RentService } from '../../../services/rent.service';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, of } from 'rxjs';
import { IRentStatistics } from '../../../models/rent.interface';
import { DialogService } from 'src/app/core/services/dialog.service';
import { environment } from 'src/environments/environment';
@UntilDestroy()
@Component({
  selector: 'app-rent-more-actions-cell',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="filter-menu">
      <!-- Detail -->
      <button mat-menu-item (click)="displaySide()">
        <mat-icon color="primary" class="menu-item" svgIcon="rent"></mat-icon>
        <span>{{ 'display_details_contract' | translate }}</span>
      </button>
      <!-- Edit -->
      <button mat-menu-item (click)="edit()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'update_data_contract' | translate }}</span>
      </button>
      <!-- Delete -->
      <button mat-menu-item (click)="delete()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'delete_contract' | translate }}</span>
      </button>
      <!-- Add Procedure -->
      <button
        mat-menu-item
        (click)="displayProcedureSide()"
        authorization
        [roleValue]="roleProcedure"
        [authName]="authCanAdd">
        <mat-icon color="primary" class="menu-item" svgIcon="list-plus"></mat-icon>
        <span>{{ 'add_procedure' | translate }}</span>
      </button>
      <!-- Log Procedures -->
      <button mat-menu-item (click)="displayLogProcedureSide()">
        <mat-icon color="primary" class="menu-item" svgIcon="rent"></mat-icon>
        <span>{{ 'action_log' | translate }}</span>
      </button>
      <!-- Financial Data -->
      <button mat-menu-item (click)="displayFinancialSide()">
        <mat-icon color="primary" class="menu-item" svgIcon="employment-benefits"></mat-icon>
        <span>{{ 'financial_data' | translate }}</span>
      </button>
      <a
        mat-menu-item
        download
        [href]="baseUrl + '/File/RentContractWorkerHome/' + params.data.id"
        style="color: inherit; font-size: inherit; font-weight: inherit;">
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
export class RentMoreActionsCellComponent extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.RentRequest;
  roleProcedure = IRoleEnum.Procedure;
  baseUrl = environment.baseURL;

  constructor(
    private _router: Router,
    private _toast: DialogService,
    private _rentService: RentService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  edit() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.rents}/update/${this.params.data.id}`);
  }

  delete() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_rent',
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
        switchMap(res => (res ? this._rentService.deleteRent(this.params.data.id) : of(null)))
      )
      .subscribe(res => {
        if (res) {
          this._rentService.setStatistics(res?.data as IRentStatistics);
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  displaySide() {
    this._rentService.setRentIdSubject(this.params.data.id);
  }

  displayFinancialSide() {
    this._rentService.setFinancialSidebar(this.params.data.id);
  }

  displayProcedureSide() {
    this._rentService.setSelectedProcedureSubject(this.params.data);
  }

  displayLogProcedureSide() {
    this._rentService.setLogProcedureIdSubject(this.params.data);
  }
}

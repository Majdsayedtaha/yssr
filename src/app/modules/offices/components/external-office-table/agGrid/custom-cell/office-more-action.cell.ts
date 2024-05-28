import { Component, OnInit, Inject, INJECTOR, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { ExternalOfficesService } from 'src/app/modules/offices/services/external-office.service';
@UntilDestroy()
@Component({
  selector: 'office-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displayDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="office-details"></mat-icon>
        <span>{{ 'table.office.display_details_office' | translate }}</span>
      </button>
      <button mat-menu-item (click)="updateOffice()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'table.office.update_data_office' | translate }}</span>
      </button>
      <button mat-menu-item (click)="addPricing()" authorization [roleValue]="rolePrice" [authName]="authCanAdd">
        <mat-icon color="primary" class="menu-item" svgIcon="add-action"></mat-icon>
        <span>{{ 'table.office.add_pricing' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteOffice()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'table.office.delete_office' | translate }}</span>
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
export class OfficesMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.ExternalOffice;
  rolePrice = IRoleEnum.AgreementPrice;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _externalOfficesService: ExternalOfficesService,
    private _router: Router) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  displayDetails() {
    this._externalOfficesService.sideOfficeDetails.next(this.params.data.id);
  }
  updateOffice() {
    this._router.navigateByUrl(
      `${AppRoutes.layout}/${AppRoutes.offices}/update-external-office/${this.params.data.id}`
    );
  }

  addPricing() {
    this._externalOfficesService.sideAddPrice.next(this.params.data);
  }

  deleteOffice() {
    this._externalOfficesService
      .deleteExternalOffice(this.params.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
      });
  }
}

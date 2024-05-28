import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ContractService } from '../../../../services/contract.service';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { IContractStatistics } from 'src/app/modules/recruitment-contracts/models';
import { ContractProcedureService } from 'src/app/modules/recruitment-contracts/services/contract-procedure.service';
import { LinkResumeService } from 'src/app/modules/recruitment-contracts/services/link-resume.service';
import { FileService } from 'src/app/modules/file/services/file.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogService } from 'src/app/core/services/dialog.service';
import { environment } from 'src/environments/environment';
@UntilDestroy()
@Component({
  selector: 'app-contracts-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displaySideContractDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="personal-data"></mat-icon>
        <span>{{ 'display_details_contract' | translate }}</span>
      </button>
      <button mat-menu-item (click)="openUpdateContract()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'update_data_contract' | translate }}</span>
      </button>
      <button
        mat-menu-item
        (click)="displaySideAddProcedure()"
        authorization
        [roleValue]="roleProcedure"
        [authName]="authCanAdd">
        <mat-icon color="primary" class="menu-item" svgIcon="add-action"></mat-icon>
        <span>{{ 'add_procedure' | translate }}</span>
      </button>
      <button mat-menu-item (click)="displaySideLinkResume()" *ngIf="!params.data.connectedWithWorker">
        <mat-icon color="primary" class="menu-item" svgIcon="link"></mat-icon>
        <span>{{ 'link_with_resume' | translate }}</span>
      </button>
      <button mat-menu-item (click)="unlinkWorker()" *ngIf="params.data.connectedWithWorker">
        <mat-icon color="primary" class="menu-item" svgIcon="link"></mat-icon>
        <span>{{ 'unlink_resume' | translate }}</span>
      </button>
      <button mat-menu-item [matMenuTriggerFor]="print">
        <mat-icon color="primary" class="menu-item" svgIcon="print"></mat-icon>
        <span>{{ 'print' | translate }}</span>
      </button>
      <button mat-menu-item [matMenuTriggerFor]="export">
        <mat-icon color="primary" class="menu-item" svgIcon="share"></mat-icon>
        <span>{{ 'export' | translate }}</span>
      </button>
      <button mat-menu-item (click)="displaySideContractProcedures()">
        <mat-icon color="primary" class="menu-item" svgIcon="audit"></mat-icon>
        <span>{{ 'action_log' | translate }}</span>
      </button>
      <button
        mat-menu-item
        (click)="deleteContractConfirmation()"
        authorization
        [roleValue]="role"
        [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'delete_contract' | translate }}</span>
      </button>
    </mat-menu>

    <mat-menu #print="matMenu">
      <a
        mat-menu-item
        style="color: inherit; font-size: inherit; font-weight: inherit;"
        [href]="baseUrl + '/File/CustomerUnified/' + params.data.id"
        download>
        <span>{{ 'print_customer_contract' | translate }}</span>
      </a>
      <a
        *ngIf="params.data.workerName"
        mat-menu-item
        style="color: inherit; font-size: inherit; font-weight: inherit;"
        [href]="baseUrl + '/File/WorkerUnified/' + params.data.id"
        download>
        <span>{{ 'print_worker_contract' | translate }}</span>
      </a>
      <a
        *ngIf="params.data.workerName"
        style="color: inherit; font-size: inherit; font-weight: inherit;"
        [href]="baseUrl + '/File/CustomerAgency/' + params.data.id"
        download
        mat-menu-item>
        <span>{{ 'print_delegation' | translate }}</span>
      </a>
      <a
        style="color: inherit; font-size: inherit; font-weight: inherit;"
        [href]="baseUrl + '/File/RecruitmentCondition/' + params.data.id"
        download
        mat-menu-item>
        <span>{{ 'print_customer_requirements' | translate }}</span>
      </a>
    </mat-menu>
    <mat-menu #export="matMenu">
      <button mat-menu-item>
        <span>{{ 'export_invoice' | translate }}</span>
      </button>
      <button mat-menu-item>
        <span>{{ 'export_voucher' | translate }}</span>
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
export class ContractsMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.RecruitmentContract;
  roleProcedure = IRoleEnum.Procedure;
  baseUrl = environment.baseURL;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fileService: FileService,
    private _contractService: ContractService,
    private _contractProcedureService: ContractProcedureService,
    private _linkResumeService: LinkResumeService,
    private _toast: DialogService,
    private _router: Router
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this._contractService.rowUpdater.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) this.params.api.applyTransaction({ update: [value] });
    });
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  displaySideAddProcedure() {
    this._contractProcedureService.sideAddProcedure.next(this.params.data);
  }

  displaySideContractProcedures() {
    this._contractProcedureService.sideContractProcedures.next(this.params.data);
  }

  displaySideContractDetails() {
    this._contractService.sideContractDetails.next(this.params.data);
  }

  displaySideLinkResume() {
    this._linkResumeService.sideLinkResume.next(this.params.data.id);
    this._linkResumeService.linkedSuccessfully.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) {
        const data = { ...this.params.data, ...(value as any).details };
        this.params.api.applyTransaction({ update: [data] });
        this.params.api.refreshCells({ force: true, rowNodes: [data] });
      }
    });
  }

  unlinkWorker() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_unlink_worker',
      firstButtonContent: 'cancel',
      secondButtonContent: 'yes',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, {
        data: toastData,
      })
      .pipe(
        untilDestroyed(this),
        switchMap(res => (res ? of([]) : of(null)))
      )
      .subscribe(res => {
        if (res) {
          const linkContract = { workerId: this.params.data.workerId, contractId: this.params.data.id };
          this._contractService.putLinkContract(linkContract).subscribe({
            next: res => {
              this._contractService.updateStatistics.next(<IContractStatistics>res?.data.statistics);
              this.params.api.applyTransaction({ update: [res.data.details] });
              this.params.api.refreshCells({ force: true, rowNodes: [res.data.details] });
            },
          });
        }
      });
  }

  openUpdateContract() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.contracts}/update/${this.params.data.id}`);
  }

  deleteContractConfirmation() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_contract',
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
            return this._contractService.deleteContract(this.params.data.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(res => {
        if (res) {
          this._contractService.updateStatistics.next(<IContractStatistics>res?.data);
          this.params.api.applyTransaction({ remove: [this.params.data] });
        }
      });
  }
}

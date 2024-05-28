import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AppRoutes, IRoleEnum } from 'src/app/core/constants';
import { WaiverService } from '../../../../services/waiver.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { WaiverSpecificationService } from 'src/app/modules/waiver-specifications/services/waiver-specifications.service';
import { LinkResumeWaiverService } from 'src/app/modules/waiver/services/link-resume-waiver.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'waiver-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="viewWaiverRequestDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="contract"></mat-icon>
        <span>{{ 'view_details' | translate }}</span>
      </button>
      <button mat-menu-item (click)="openUpdateContract()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'update_request' | translate }}</span>
      </button>
      <button
        mat-menu-item
        (click)="displaySideLinkResume()"
        *ngIf="!params.data.connectedWithWorker && params.data.isExternal">
        <mat-icon color="primary" class="menu-item" svgIcon="link"></mat-icon>
        <span>{{ 'link_with_resume' | translate }}</span>
      </button>
      <button mat-menu-item (click)="unlinkWorker()" *ngIf="params.data.connectedWithWorker && params.data.isExternal">
        <mat-icon color="primary" class="menu-item" svgIcon="link"></mat-icon>
        <span>{{ 'unlink_resume' | translate }}</span>
      </button>
      <button
        mat-menu-item
        (click)="deleteRequestConfirmation()"
        authorization
        [roleValue]="role"
        [authName]="authCanDelete">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'delete_request' | translate }}</span>
      </button>
      <button mat-menu-item [matMenuTriggerFor]="print">
        <mat-icon color="primary" class="menu-item" svgIcon="print"></mat-icon>
        <span>{{ 'print' | translate }}</span>
      </button>
    </mat-menu>

    <mat-menu #print="matMenu">
      <button mat-menu-item>
        <span>{{ 'print_request' | translate }}</span>
      </button>
      <button mat-menu-item>
        <span>{{ 'print_receipt' | translate }}</span>
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
export class WaiverMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  role = IRoleEnum.WaiverRequest;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _waiverService: WaiverService,
    private _waiverSpecificationService: WaiverSpecificationService,
    private _linkResumeWaiverService: LinkResumeWaiverService,
    private _toast: DialogService,
    private _router: Router
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  viewWaiverRequestDetails() {
    !this.params.data.isExternal
      ? this._waiverService.waiverRequestId.next(this.params.data.id)
      : this._waiverSpecificationService.requestId.next(this.params.data.id);
  }

  openUpdateContract() {
    if (this.params.data.isExternal === true) {
      this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.waivers}/worker-update/${this.params.data.id}`);
    } else if (this.params.data.isExternal === false) {
      this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.waivers}/waiver-update/${this.params.data.id}`);
    }
  }

  displaySideLinkResume() {
    this._linkResumeWaiverService.sideLinkResume.next(this.params.data.id);
    this._linkResumeWaiverService.linkedSuccessfully.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) {
        const data = { ...this.params.data, ...value };
        this.params.api.applyTransaction({ update: [data] });
        this.params.api.refreshCells({ force: true, rowNodes: [data] });
      }
    });
  }

  unlinkWorker() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_unlink_worker_wavier',
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
          const linkContract = { workerId: this.params.data.worker.id, id: this.params.data.id };
          this._waiverSpecificationService.putLinkRequest(linkContract).subscribe({
            next: res => {
              // this._contractService.updateStatistics.next(<IContractStatistics>res?.data.statistics);
              this.params.api.applyTransaction({ update: [res.data] });
              this.params.api.refreshCells({ force: true, rowNodes: [res.data] });
            },
            error: () => {
              // TODO
              // this.contractLinkResumes[idx].loading = true;
            },
          });
        }
      });
  }

  deleteRequestConfirmation() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_delete_request',
      firstButtonContent: 'back_table',
      secondButtonContent: 'yes_surely',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, { data: toastData })
      .pipe(
        switchMap(res => {
          if (res) return this._waiverSpecificationService.deleteWaiverRequest(this.params.data.id);
          else return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          this.params.api.applyTransaction({ remove: [this.params.data] });
          this.params.context?.parentComp?.getWaiverRequestsList();
        }
      });
  }
}

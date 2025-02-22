import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogComplaintsComponent } from '../dialog/dialog-complaints/dialog-complaints.component';
import { ComplaintsService } from '../services/complaints.service';
import { IEnum } from 'src/app/core/interfaces';

@UntilDestroy()
@Component({
  selector: 'app-complaints-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="updateComplaints()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'label.complaints.update' | translate }}</span>
      </button>
      <button mat-menu-item [matMenuTriggerFor]="updateStatusMenu">
        <mat-spinner *ngIf="isLoading" matPrefix [diameter]="20"></mat-spinner>
        <span> {{ 'field.complaints.update_problem_status' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteComplaints()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'label.complaints.delete' | translate }}</span>
      </button>
    </mat-menu>
    <mat-menu #updateStatusMenu="matMenu">
      <button
        *ngFor="let status of params.context?.parentComp?.updateStatusArr"
        mat-menu-item
        (click)="params.data.status.id !== status.id ? updateStatus(status) : ''"
        [ngStyle]="{
          'background-color': params.data.status.id === status.id ? 'var(--primary-color)' : '',
          color: params.data.status.id === status.id ? 'white' : ''
        }">
        <span>{{ status.name }}</span>
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
export class ComplaintsMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  isLoading: boolean = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _complaintsService: ComplaintsService
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  updateComplaints() {
    const dialogRef = this.matDialog.openDialog(DialogComplaintsComponent, {
      data: { data: this.params.data, update: true },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          const data = {
            id: this.params.data.id,
            customer: res.customer,
            description: res.description,
            suggestedSolution: res.suggestedSolution,
            status: res.status,
            solutionDays: res.solutionDays,
            finalSolution: res.finalSolution,
          };
          this.params.api.applyTransaction({ update: [data] });
          this.matDialog.closeAll();
        }
      },
    });
  }

  deleteComplaints() {
    this._complaintsService
      .deleteComplaints(this.params.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
      });
  }
  updateStatus(status: IEnum) {
    this._complaintsService
      .updateComplaintStatus(this.params.data.id, status.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.data.status = status;
        this.params.api.refreshCells({ columns: ['status'] });
      });
  }
}

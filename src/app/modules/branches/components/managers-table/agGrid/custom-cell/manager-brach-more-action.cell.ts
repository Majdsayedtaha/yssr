import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { AppRoutes } from 'src/app/core/constants';
import { BranchService } from 'src/app/modules/branches/services/branch.service';

@UntilDestroy()
@Component({
  selector: 'app-branches-more-actions',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="displayDetails()">
        <mat-icon color="primary" class="menu-item" svgIcon="office-details"></mat-icon>
        <span>{{ 'table.branch.display_details_branch' | translate }}</span>
      </button>
      <button mat-menu-item (click)="updateBranch()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'table.branch.update_data_branch' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteBranch()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'table.branch.delete_branch' | translate }}</span>
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
export class BranchesManagerMoreActionsCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  constructor(private _router: Router, private _branchService: BranchService) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  displayDetails() {
    this._branchService.sideBranchManagerDetails.next(this.params.data.id);
  }
  updateBranch() {
    this._router.navigateByUrl(
      `${AppRoutes.layout}/${AppRoutes.branches}/update-manager-branch/${this.params.data.id}`
    );
  }

  deleteBranch() {
    this._branchService
      .deleteBranchManager(this.params.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
      });
  }
}

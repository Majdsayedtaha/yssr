import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IEnum } from 'src/app/core/interfaces';
import { ProjectService } from 'src/app/modules/managing-operations/services/project.service';
import { IProjectStatistics } from 'src/app/modules/managing-operations/models/project.interface';
import { DialogAddProjectComponentComponent } from '../../dialog-add-project-component/dialog-add-project-component.component';

@UntilDestroy()
@Component({
  selector: 'app-project-cell',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="more-actions-menu">
      <button mat-menu-item (click)="updateProject()">
        <mat-icon color="primary" class="menu-item" svgIcon="pen"></mat-icon>
        <span>{{ 'label.managing_operations.update_project' | translate }}</span>
      </button>
      <button mat-menu-item (click)="deleteProject()">
        <mat-icon color="primary" class="menu-item" svgIcon="delete"></mat-icon>
        <span>{{ 'label.managing_operations.delete_project' | translate }}</span>
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
export class ProjectCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  isLoading: boolean = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _ProjectService: ProjectService
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  updateProject() {
    const dialogRef = this.matDialog.openDialog(DialogAddProjectComponentComponent, {
      data: { data: this.params.data, update: true },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          const data = {
            id: this.params.data.id,
            startDate: res.startDate,
            endDate: res.endDate,
            nameEn: res.nameEn,
            nameAr: res.nameAr,
          };
          this.params.api.applyTransaction({ update: [data] });
          this._ProjectService.updateStatistics.next(<IProjectStatistics>res?.data);
          this.matDialog.closeAll();
        }
      },
    });
  }

  deleteProject() {
    this._ProjectService
      .deleteProject(this.params.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
        this._ProjectService.updateStatistics.next(<IProjectStatistics>res?.data);
      });
  }
}

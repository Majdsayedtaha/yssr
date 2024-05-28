import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DialogPositionComponent } from '../dialog/dialog-position/dialog-position.component';
import { PositionsService } from '../../../services/position.service';
import { IPosition } from '../../../models/position.interface';
import { ICellRendererParams } from 'ag-grid-community';
import { IRoleEnum } from 'src/app/core/constants';

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="edit()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteRow()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class PositionActionCellComponent extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: ICellRendererParams;
  public role = IRoleEnum.Template;
  constructor(
    private _matDialog: DialogService,
    @Inject(INJECTOR) injector: Injector,
    private _positionsService: PositionsService
  ) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  deleteRow() {
    this._positionsService.deleteRole(this.cell.data.id).subscribe(res => {
      this.cell.context.parentComp.gridApi.applyTransaction({ remove: [this.cell.data] });
    });
  }

  edit() {
    this._matDialog
      .openDialog(DialogPositionComponent, {
        data: {
          id: this.cell.data.id,
        },
      })
      .subscribe(res => {
        if (res.position && res.type === 'edit') {
          const position: IPosition = {
            nameAr: res.position.nameAr,
            nameEn: res.position.nameEn,
            id: this.cell.data.id,
          };
          this.cell.context.parentComp.gridApi.applyTransaction({ update: [position] });
        }
      });
  }
}

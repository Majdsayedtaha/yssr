import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IPermission } from 'src/app/modules/settings/models';

@Component({
  selector: 'app-select-all-checkbox.cell',
  template: `
    <mat-checkbox
      class="checkbox"
      color="primary"
      [checked]="params.value && params.context.parentComp.rowData.length > 0"
      (click)="toggleSelectAll()"></mat-checkbox>
    <span>{{ 'all_permissions' | translate }}</span>
  `,
  styles: [],
})
export class SelectAllCheckboxCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  data!: IPermission[];

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  toggleSelectAll() {
    this.data = this.params.context?.parentComp?.rowData;
    const selectedBefore: IPermission[] = this.data.filter(
      row =>
        row.all === true &&
        row.canAdd === true &&
        row.canDelete === true &&
        row.canUpdate === true &&
        row.canView === true
    );

    if (selectedBefore.length === 0) this.toggleStatusOfPermissions(true);
    else this.toggleStatusOfPermissions(false);

    this.params.api.applyTransaction({ update: this.data });
    this.params.context.parentComp.newData.next(this.data);
  }

  toggleStatusOfPermissions(status: boolean) {
    this.data?.forEach((row: IPermission) => {
      row.all = row.canAdd = row.canDelete = row.canUpdate = row.canView = status;
      this.params.api.getRowNode(row.id)?.setData(row);
    });
  }
}

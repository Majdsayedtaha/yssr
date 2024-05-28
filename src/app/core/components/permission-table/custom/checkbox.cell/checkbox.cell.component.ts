import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IPermission } from 'src/app/modules/settings/models';

interface CheckboxCellRendererAngularComp extends ICellRendererParams {
  readonly: boolean;
}

@Component({
  selector: 'app-checkbox.cell',
  template: `<mat-checkbox
    class="checkbox"
    color="primary"
    [disabled]="(columnSelectAll !== params.column?.getColId() && allSelected) || params.readonly"
    [checked]="params.value"
    (click)="columnSelectAll == params.column?.getColId() ? toggleSelectAll() : toggleCheckbox()"></mat-checkbox>`,
  styles: [],
})
export class CheckboxCell implements ICellRendererAngularComp {
  params!: CheckboxCellRendererAngularComp;
  columnSelectAll: string = 'all';
  data!: IPermission;
  allSelected = false;

  constructor() {}

  agInit(params: CheckboxCellRendererAngularComp): void {
    this.params = params;
    this.allSelected = this.params?.data?.all;
  }

  refresh(params: CheckboxCellRendererAngularComp): boolean {
    return false;
  }

  toggleSelectAll() {
    this.allSelected = !this.allSelected;
    this.data = {
      ...this.params.data,
      canView: !this.params.value,
      canAdd: !this.params.value,
      canUpdate: !this.params.value,
      canDelete: !this.params.value,
      all: !this.params.value,
    };
    this.canAccess(this.data);
  }

  toggleCheckbox() {
    const data: any = this.params.data;
    const key: any = this.params.column?.getColId() ?? '';
    data[key] = !this.params.value;
    if (
      !(this.params.data.canView && this.params.data.canAdd && this.params.data.canUpdate && this.params.data.canDelete)
    ) {
      data.all = data.canAdd && data.canDelete && data.canUpdate && data.canView;
      this.canAccess(data);
    } else {
      this.data = { ...this.params.data, all: true };
      this.canAccess(this.data);
    }
  }

  canAccess(data: IPermission) {
    this.params.api.applyTransaction({ update: [data] });
    const rowData: IPermission[] = this.params.context.parentComp.rowData;
    const idx = rowData.findIndex((el: IPermission) => el.id === data.id);
    this.params.context.parentComp.rowData[idx] = data;
    this.params.api.getRowNode(data.id)?.setData(data);
    this.params.context.parentComp.newData.next(rowData);
  }
}

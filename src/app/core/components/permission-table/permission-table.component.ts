import { IPermission } from 'src/app/modules/settings/models';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CheckboxCell } from './custom/checkbox.cell/checkbox.cell.component';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { BehaviorSubject } from 'rxjs';
import { Component, INJECTOR, Inject, Injector, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SelectAllCheckboxCell } from './custom/checkbox.cell/select-all-checkbox.component';

@Component({
  selector: 'permission-table',
  templateUrl: './permission-table.component.html',
  styleUrls: ['./permission-table.component.scss'],
})
export class PermissionTableComponent extends CoreBaseComponent implements OnInit, OnChanges {
  //#region Decorators
  @Input('readonly') readonly!: boolean;
  @Input('rowData') rowData: IPermission[] = [];
  @Input('userId') userId!: string;
  @Output('newData') newData: BehaviorSubject<IPermission[]> = new BehaviorSubject<IPermission[]>([]);
  //#endregion

  //#region Variables
  public gridApi!: GridApi;
  public columnDefs!: ColDef[];
  protected isLoading = false;
  protected override enableFilterAndSortOfTable = false;
  //#endregion

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.initialColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowData']) {
      this.gridApi?.setRowData(this.rowData);

      // For deselect "Select All Permissions" checkbox in header of table.
      if (this.rowData.length === 0) this.gridApi?.refreshHeader();
    }
    if (typeof changes['readonly']?.currentValue === 'boolean') {
      this.initialColumns();
    }
  }

  initialColumns() {
    this.columnDefs = [
      {
        headerName: 'table.permission.access',
        field: 'name',
      },
      {
        headerName: 'table.permission.view',
        field: 'canView',
        filter: false,
        sortable: false,
        cellRenderer: CheckboxCell,
        cellRendererParams: {
          readonly: this.readonly,
        },
        maxWidth: 130,
      },
      {
        headerName: 'table.permission.add',
        field: 'canAdd',
        filter: false,
        sortable: false,
        cellRenderer: CheckboxCell,
        cellRendererParams: {
          readonly: this.readonly,
        },
        maxWidth: 130,
      },
      {
        headerName: 'table.permission.update',
        field: 'canUpdate',
        filter: false,
        sortable: false,
        cellRenderer: CheckboxCell,
        cellRendererParams: {
          readonly: this.readonly,
        },
        maxWidth: 130,
      },
      {
        headerName: 'table.permission.delete',
        field: 'canDelete',
        filter: false,
        sortable: false,
        cellRenderer: CheckboxCell,
        cellRendererParams: {
          readonly: this.readonly,
        },
        maxWidth: 130,
      },
      ...(this.readonly
        ? []
        : [
            {
              headerName: 'table.permission.all',
              field: 'all',
              filter: false,
              sortable: false,
              cellRenderer: CheckboxCell,
              cellRendererParams: {
                readonly: this.readonly,
              },
              maxWidth: 130,
            },
            {
              field: 'selectAll',
              filter: false,
              sortable: false,
              headerComponent: SelectAllCheckboxCell,
            },
          ]),
    ];
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }
}

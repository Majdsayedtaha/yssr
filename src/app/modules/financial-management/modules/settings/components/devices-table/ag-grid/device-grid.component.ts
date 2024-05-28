import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IDevice } from '../../../models/device.interface';
import { DeviceMoreActionsCell } from '../more-action/device-more-action.cell';
@Component({
  selector: 'app-Device-grid',
  template: '',
})
export class DeviceGridComponent extends CoreBaseComponent {
  public rowData: IDevice[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'table.device.name_device_ar',
        field: 'nameAr',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.device.name_device_en',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.financial_management.bank',
        field: 'bank.name',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },

      {
        headerName: '',
        field: 'actions',
        maxWidth: 60,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: DeviceMoreActionsCell,
      },
    ];
  }
}

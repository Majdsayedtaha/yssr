import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IHousing } from '../../../models';
import { ColDef } from 'ag-grid-community';
import { HousingMoreActionsCellComponent } from '../housing-more-actions-cell/housing-more-actions-cell.component';

@Component({
  selector: 'app-housing-grid',
  templateUrl: './housing-grid.component.html',
  styleUrls: ['./housing-grid.component.scss'],
})
export class HousingGridComponent extends CoreBaseComponent {
  public rowData!: IHousing[];

  public columnDefs: ColDef[] = [
    {
      headerName: 'table.housing.name',
      field: 'name',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.rooms_count',
      field: 'apartmentsCount',
      filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.location',
      field: 'location',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.city',
      field: 'city.name',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.street_en',
      field: 'streetEn',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.street_ar',
      field: 'street',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.district_ar',
      field: 'district',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.district_en',
      field: 'districtEn',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.capacity',
      field: 'capacity',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.unit_number',
      field: 'unitNumber',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.postal_code',
      field: 'postalCode',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.building_number',
      field: 'buildingNumber',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: 'table.housing.additional_code',
      field: 'additionalCode',
      filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
    },
    {
      headerName: '',
      field: 'actions',
      pinned: 'left',
      maxWidth: 60,
      filter: false,
      sortable: false,
      resizable: false,
      cellRenderer: HousingMoreActionsCellComponent,
    },
  ];

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }
}

import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IOfficeUser } from '../../../models/office-user.interface';
@Component({
  selector: 'app-office-grid',
  template: '',
})
export class OfficeUsersGridComponent extends CoreBaseComponent {
  public rowData: IOfficeUser[] = [];
  public columnDefs: ColDef[] = [];

  constructor(@Inject(INJECTOR) injectorCh: Injector) {
    super(injectorCh);
    this.columnDefs = [
      {
        headerName: 'user_nameAr',
        field: 'nameAr',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'user_nameEn',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'first_mobile',
        field: 'mobileFirst',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'second_mobile',
        field: 'mobileSecond',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'first_email',
        field: 'emailFirst',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        headerComponentParams: {
          stopSort: true,
        },
      },
      {
        headerName: 'second_email',
        field: 'emailSecond',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
        headerComponentParams: {
          stopSort: true,
        },
      },
    ];
  }
}

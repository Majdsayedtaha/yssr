import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { CustomerService } from '../../services/customer.service';
import { ICustomerFormData } from '../../models';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'side-data',
  templateUrl: './side-data.component.html',
  styleUrls: ['./side-data.component.scss'],
})
export class SideDataComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  customerData!: ICustomerFormData;
  public columnDefs: ColDef[] = [];
  isLoading = false;
  protected override enableFilterAndSortOfTable = false;

  constructor(@Inject(INJECTOR) injector: Injector, public customerService: CustomerService) {
    super(injector);
  }

  ngOnInit(): void {
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
    this.columnDefs = [
      {
        headerName: 'setting.fields.employee_ar',
        field: 'nameAr',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.employee_en',
        field: 'nameEn',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'creation_date',
        field: 'creationDate',
      },
      {
        headerName: 'business_position',
        field: 'businessPosition.name',
      },
      {
        headerName: 'phone',
        field: 'phone',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'email',
        field: 'email',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
    ];
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.customerService.sideData.pipe(untilDestroyed(this)).subscribe(id => {
      if (id) {
        this.isLoading = true;
        this.sidenav.open();
        this.customerService
          .getCustomerDetails(id)
          .pipe(untilDestroyed(this))
          .subscribe(customerDetails => {
            this.customerData = customerDetails.data as ICustomerFormData;
            this.isLoading = false;
          });
      }
    });
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.getBusinessList();
  }
  getBusinessList() {
    return this.customerData.business;
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.customerService.sideData.next('');
  }
}

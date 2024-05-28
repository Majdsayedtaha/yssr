import { Component, INJECTOR, Inject, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomerIdentifiedGridComponent } from './ag-grid/customer-identified-grid.component';
import { CustomerService } from 'src/app/modules/customers/services/customer.service';
import { SelectionChangedEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'src/app/core/services/notifier.service';
@Component({
  selector: 'app-identify-customer',
  templateUrl: './identify-customer.component.html',
  styleUrls: ['./identify-customer.component.scss'],
})
export class IdentifyCustomerComponent extends CustomerIdentifiedGridComponent {
  @Input() customer!: FormGroup;
  isLoading = false;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _customerService: CustomerService,
    private _snackBar: NotifierService,
    private _translate: TranslateService
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  searchOnCustomer() {
    const filterValue = this.customer.get('searchCustomer')?.value;
    if (!filterValue) return;
    this.isLoading = true;
    // this.paginationOptions.pageNumber = 0;
    this._customerService.getContractCustomers(filterValue).subscribe({
      next: res => {
        this.gridOptions?.api?.setRowData(res.data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onSelectionChanged(e: SelectionChangedEvent) {
    const selectedRows = this.gridOptions.api?.getSelectedRows();
    if (selectedRows && selectedRows?.length > 0) {
      if (selectedRows[0].isBlocked === true) {
        this._snackBar.showNormalSnack(this.translateService.instant('toast.you-cannot-choose-blocked-customer'));
        this.gridOptions.api?.deselectAll();
        this.customer.get('customerId')?.setValue('');
        return;
      }
      this.customer.get('customerId')?.setValue(selectedRows[0].id);
      this.customer.parent
        ?.get('contractData')
        ?.get('customerId')
        ?.setValue({
          id: selectedRows[0].id,
          name: this._translate.currentLang === 'ar' ? selectedRows[0].nameAr : selectedRows[0].nameEn,
        });
    }
  }
}

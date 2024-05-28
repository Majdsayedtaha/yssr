// import { Component, INJECTOR, Inject, Injector } from '@angular/core';

// import { ColDef, ICellRendererParams } from 'ag-grid-community';
// import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
// import { ICustomer, ICustomerStatistics } from 'src/app/modules/customers/models';
// import { CheckboxFilterAgGridComponent } from '../../../customers-table/ag-grid/custom-cells/checkbox-filter';
// import { CustomersStatusCell } from '../../../customers-table/ag-grid/custom-cells/customer-status.cell';
// import { CustomersMoreActionsCell } from '../../../customers-table/ag-grid/custom-cells/customers-more-actions.cell';
// import { DateFilterComponent } from '../../../customers-table/ag-grid/custom-cells/date-filter.component';
// import { NumberFilterComponent } from '../../../customers-table/ag-grid/custom-cells/number-filter.component';
// import { PhoneFilterComponent } from '../../../customers-table/ag-grid/custom-cells/phone-filter.component';
// import { TextFilterComponent } from '../../../customers-table/ag-grid/custom-cells/text-filter.component';
// import { BusinessCaseActionCell } from './custom-cells/business-case-action.cell';

// @Component({
//   selector: 'app-business-grid',
//   template: '',
// })
// export class BusinessGridComponent extends CoreBaseComponent {
//   public rowData!: ICustomer[];
//   public customerListData!: ICustomer[];
//   public customerStatistics!: ICustomerStatistics;
//   public paginationOptions = { pageNumber: 0 };
//   public columnDefs: ColDef[] = [
//     {
//       headerName: 'person_name_arabic',
//       field: 'nameAr',
//     },
//     {
//       headerName: 'person_name_english',
//       field: 'nameEn',
//     },
//     {
//       headerName: 'creation_date',
//       field: 'creationDate',
//     },
//     {
//       headerName: 'business_position',
//       field: 'businessPositionId',
//       cellRenderer: (params: ICellRendererParams) => {
//         return this.businessPositions.find(b => {
//           return b.id === params.data.businessPositionId;
//         })?.name;
//       },
//     },
//     {
//       headerName: 'phone',
//       field: 'phone',
//     },
//     {
//       headerName: 'email',
//       field: 'email',
//     },
//     {
//       headerName: '',
//       field: 'actions',
//       pinned: 'left',
//       cellRenderer: BusinessCaseActionCell,
//       cellRendererParams: {
//         formGroup: this.businessCaseGroup,
//       },
//       width: 100,
//       minWidth: 100,
//       maxWidth: 100,
//     },
//   ];

//   constructor(@Inject(INJECTOR) injectorCh: Injector) {
//     super(injectorCh);
//   }
// }

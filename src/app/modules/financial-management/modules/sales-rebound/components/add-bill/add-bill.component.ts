import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { SalesReboundGridComponent } from './ag-grid/sales-rebound.grid.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { IBillReturnSales, IBillsReturnTableSales } from '../../models/bill-rebound.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesReboundService } from '../../services/sales-rebound.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SalesService } from '../../../sales/services/sales.service';
import { AppRoutes } from 'src/app/core/constants';
@UntilDestroy()
@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent extends SalesReboundGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  salesReboundFrom!: FormGroup;
  isLoading: boolean = false;
  loadingData: boolean = false;
  add: boolean = false;
  salesReboundId!: string;
  returnRequest!: number;
  gridApi!: GridApi;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _salesReboundService: SalesReboundService,
    private _salesService: SalesService,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.salesReboundId = this._activatedRoute.snapshot.params['id'];
    this.salesReboundId ? this.getSalesReboundInfo() : this.generateBillNumber();
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
    this.watchMainBillIdChange();
    this.watchReturnNumber();
  }

  onGridReady(params: GridReadyEvent<IBillReturnSales>) {
    this.gridApi = params.api;
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
  }

  initForm() {
    this.salesReboundFrom = this._fb.group({
      mainBillId: [null, Validators.required],
      date: [null, Validators.required],
      billNumber: [null, Validators.required],
      typeId: [null, Validators.required],
      returnedBillTypeId: [null, Validators.required],
      returnRequestId: [null],
      services: this._fb.array([]),
      // customerId: [null],
      // dueDate: [null, Validators.required],
    });
  }

  generateBillNumber() {
    this._salesService.generateBillNumber().subscribe(res => {
      this.salesReboundFrom.get('billNumber')?.setValue(res.data);
    });
  }

  watchMainBillIdChange() {
    this.salesReboundFrom.get('returnRequestId')?.valueChanges.subscribe(id => {
      if (id && !this.salesReboundId) this.getServices(id);
      else this.clearServices();
    });
  }
  watchReturnNumber() {
    this.salesReboundFrom.get('returnedBillTypeId')?.valueChanges.subscribe(data => {
      if (data) {
        this.returnRequest = data.value;
        if (this.returnRequest === 2) {
          this.salesReboundFrom.get('returnRequestId')?.addValidators(Validators.required);
          this.salesReboundFrom.get('returnRequestId')?.updateValueAndValidity();
        } else {
          this.salesReboundFrom.get('returnRequestId')?.removeValidators(Validators.required);
          this.salesReboundFrom.get('returnRequestId')?.updateValueAndValidity();
        }
      }
    });
  }

  getServices(returnRequestId: string) {
    this._salesReboundService
      .getReturnRequestServices(returnRequestId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.FillServices(res.data);
      });
  }

  getSalesReboundInfo() {
    this._salesReboundService
      .getReturnSalesDetails(this.salesReboundId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.patchFormData(res.data);
        },
      });
  }

  patchFormData(data: IBillsReturnTableSales) {
    this.salesReboundFrom.patchValue({
      billNumber: data.billNumber,
      date: data.date,
      returnRequestId: data.returnRequest,
      returnedBillTypeId: data.returnedBillType,
      mainBillId: data.mainBill,
      typeId: data.type,
      services: data.services,
    });
    this.rowData = data.services;
  }

  addSalesRebound() {
    this.isLoading = true;
    const salesReturn = {
      ...this.salesReboundFrom.getRawValue(),
      mainBillId: this.salesReboundFrom.value['mainBillId']?.id
        ? this.salesReboundFrom.value['mainBillId']?.id
        : this.salesReboundFrom.value['mainBillId'],
      returnedBillTypeId: this.salesReboundFrom.value['returnedBillTypeId']?.id
        ? this.salesReboundFrom.value['returnedBillTypeId']?.id
        : this.salesReboundFrom.value['returnedBillTypeId'],
    };
    delete salesReturn.services;
    delete salesReturn.customerId;
    this._salesReboundService
      .addReturnSales(salesReturn)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.salesReboundFrom.reset();
          this.rowData = [];
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  updateSalesRebound() {
    this.isLoading = true;
    const updateSalesReturn = {
      ...this.salesReboundFrom.getRawValue(),
      mainBillId: this.salesReboundFrom.value['mainBillId']?.id
        ? this.salesReboundFrom.value['mainBillId']?.id
        : this.salesReboundFrom.value['mainBillId'],
      returnedBillTypeId: this.salesReboundFrom.value['returnedBillTypeId']?.id
        ? this.salesReboundFrom.value['returnedBillTypeId']?.id
        : this.salesReboundFrom.value['returnedBillTypeId'],
      returnRequestId: this.salesReboundFrom.value['returnRequestId']?.id
        ? this.salesReboundFrom.value['returnRequestId']?.id
        : this.salesReboundFrom.value['returnRequestId'],
    };
    this._salesReboundService
      .updateReturnSales(this.salesReboundId, updateSalesReturn)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.salesReboundFrom.reset();
          this.rowData = [];
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/sales-rebound/bills-table`);
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  FillServices(rowData: any) {
    rowData.forEach((data: any) => {
      (this.salesReboundFrom.get('services') as FormArray)?.push(this._fb.group(data));
    });
    this.gridApi.setRowData(rowData);
  }

  clearServices() {
    (this.salesReboundFrom.get('services') as FormArray).clear();
    this.gridApi.setRowData([]);
  }
}

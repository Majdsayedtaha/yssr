import { ActivatedRoute, Router } from '@angular/router';
import { IBillSales } from '../../models/bill.interface';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { SalesGridComponent } from './ag-grid/sales.grid.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogServiceFormComponent } from './dialog/dialog-service-form/dialog-service-form.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IEnum } from 'src/app/core/interfaces';
import { SalesService } from '../../services/sales.service';
import { AppRoutes } from 'src/app/core/constants';
@UntilDestroy()
@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent extends SalesGridComponent implements OnInit {
  salesFrom!: FormGroup;
  isLoading: boolean = false;
  loadingData: boolean = false;
  salesId!: string;
  gridApi!: GridApi;
  billTypes: IEnum[] = [];
  paymentMethodOptions: IEnum[] = [];
  paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  get f() {
    return this.salesFrom?.controls;
  }

  get billTypeValue(): number {
    const billTypeId = this.f['typeId']?.value;
    return (
      this.billTypes?.find(r => {
        return r.id === billTypeId;
      })?.value || -1
    );
  }

  get paymentMethodValue(): number {
    const paymentMethodId = this.f['paymentDestination']?.value;
    return (
      this.paymentMethodOptions?.find(r => {
        return r.id === paymentMethodId;
      })?.value || -1
    );
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _matDialog: DialogService,
    private _activatedRoute: ActivatedRoute,
    private _salesService: SalesService,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.salesId = this._activatedRoute.snapshot.params['id'];
    this.salesId ? this.getSalesInfo() : this.generateBillNumber();
    this.initForm();
    this.watchChangesFormControls();
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };

    this.getBillTypes().subscribe(res => {
      this.billTypes = res.data;
    });

    this.getPaymentDestinations().subscribe(res => {
      this.paymentMethodOptions = res.data;
    });
  }

  onGridReady(params: GridReadyEvent<IBillSales>) {
    this.gridApi = params.api;
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
  }

  generateBillNumber() {
    this._salesService.generateBillNumber().subscribe(res => {
      this.salesFrom.get('billNumber')?.setValue(res.data);
    });
  }

  initForm() {
    this.salesFrom = this._fb.group({
      date: [null, Validators.required],
      billNumber: [null, Validators.required],
      checkNumber: [null],
      checkDueDate: [null],
      network: [null],
      paymentDestination: [null],
      bank: [null],
      store: [null],
      typeId: [null, Validators.required],
      customerId: [null, Validators.required],
      // returnedBillTypeId
      // returnRequestId
      dateTransfer: [null],
      services: this._fb.array([], [Validators.required]),
    });
  }

  watchChangesFormControls() {
    this.watchBillTypeFormControl();
    this.watchPaymentMethodFormControl();
  }

  watchBillTypeFormControl() {
    this.salesFrom
      .get('typeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.billTypeValue == 2) {
          this.updateValidation(this.salesFrom, ['paymentDestination'], Validators.required);
        } else {
          this.updateValidation(
            this.salesFrom,
            ['paymentDestination', 'store', 'bank', 'checkNumber', 'checkDueDate', 'network'],
            Validators.nullValidator
          );
        }
      });
  }

  watchPaymentMethodFormControl() {
    this.salesFrom
      .get('paymentDestination')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        //Reset
        this.updateValidation(
          this.salesFrom,
          ['store', 'bank', 'checkNumber', 'checkDueDate', 'network'],
          Validators.nullValidator
        );

        // Payment Method Cash Strategy
        if (this.paymentMethodValue == 1) {
          this.updateValidation(this.salesFrom, ['store'], Validators.required);
        }

        // Payment Method Transferring Strategy
        if (this.paymentMethodValue == 2) {
          this.updateValidation(this.salesFrom, ['bank'], Validators.required);
        }

        // Payment Method Check Strategy
        if (this.paymentMethodValue == 3) {
          this.updateValidation(this.salesFrom, ['checkNumber', 'checkDueDate', 'bank'], Validators.required);
        }

        // Payment Method Network Strategy
        if (this.paymentMethodValue == 4) {
          this.updateValidation(this.salesFrom, ['network'], Validators.required);
        }
      });
  }

  updateSales() {
    this.isLoading = true;

    const services = this.salesFrom.value.services.map((s: any) => {
      return {
        ...s,
        mainServiceId: s.mainService?.id,
        parallelServiceId: s.parallelService?.id,
        requestId: s.request?.id,
        taxTypeId: s.taxType?.id,
      };
    });
    const updateSales = {
      ...this.salesFrom.value,
      customerId: this.salesFrom.value.customerId.id,
      services: services,
      paymentDestinationId: this.salesFrom.value.paymentDestination?.id || this.salesFrom.value.paymentDestination,
      storeId: this.salesFrom.value.store?.id || this.salesFrom.value.store,
      bankId: this.salesFrom.value.bank?.id || this.salesFrom.value.bank,
      networkId: this.salesFrom.value.network?.id || this.salesFrom.value.network,
    };
    delete updateSales?.paymentDestination;
    delete updateSales?.store;
    delete updateSales?.network;
    this._salesService
      .updateSales(this.salesId, updateSales)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.salesFrom.reset();
          this.rowData = [];
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/sales/bills-table`);
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  addSales() {
    const newSales = {
      ...this.salesFrom.getRawValue(),
      customerId: this.salesFrom.value.customerId.id,
      paymentDestinationId: this.salesFrom.value.paymentDestination?.id || this.salesFrom.value.paymentDestination,
      storeId: this.salesFrom.value.store?.id || this.salesFrom.value.store,
      bankId: this.salesFrom.value.bank?.id || this.salesFrom.value.bank,
      networkId: this.salesFrom.value.network?.id || this.salesFrom.value.network,
    };
    delete newSales?.paymentDestination;
    delete newSales?.store;
    delete newSales?.network;
    this.isLoading = true;
    this._salesService
      .addSales(newSales)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.salesFrom.reset();
          this.rowData = [];
          this.generateBillNumber();
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getSalesInfo() {
    this._salesService
      .getSalesDetails(this.salesId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.salesFrom.patchValue({
          billNumber: res.data.billNumber,
          date: res.data.date,
          typeId: res.data.type,
          customerId: res.data.customer,
          paymentDestination: res.data.paymentDestination,
          store: res.data.store,
          checkNumber: res.data.checkNumber,
          bank: res.data.bank,
          network: res.data.network,
        });
        setTimeout(() => {
          this.salesFrom.get('checkDueDate')?.setValue(res.data.checkDueDate);
        }, 200);
        res.data.services.forEach(s => {
          (this.salesFrom.get('services') as FormArray).push(this._fb.group(s));
        });
        this.rowData = res.data.services;
      });
  }

  openAddService() {
    this._matDialog
      .openDialog(DialogServiceFormComponent)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          (this.salesFrom.get('services') as FormArray).push(
            this._fb.group({
              requestId: res.serviceNumber.id ? res.serviceNumber.id : res.serviceNumber,
              details: res.details,
              description: res.description,
              accountNumber: res.accountNumber,
              amount: res.contractAmount,
              taxTypeId: res.taxType?.id ? res.taxType.id : res.taxType,
              parallelServiceId: res.serviceName?.id ? res.serviceName?.id : res.serviceName,
            })
          );
          this.gridApi.applyTransaction({ add: [res] });
        }
      });
  }
}

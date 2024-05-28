import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExchangeService } from '../../services/exchange.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppRoutes } from 'src/app/core/constants';
import { BillsExchangeGridComponent } from './ag-grid/receipt.grid.component';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DialogBillsExchangeComponent } from './dialog-BillsExchange/dialog-BillsExchange.component';
@UntilDestroy()
@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent extends BillsExchangeGridComponent implements OnInit {
  billExchangeFrom!: FormGroup;
  isLoading: boolean = false;
  loadingData: boolean = false;
  billExchangeId!: string;
  companyTaxValue!: number;
  paymentDisplay!: number;
  gridApi!: GridApi;
  paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  get formControls() {
    return this.billExchangeFrom.controls;
  }

  constructor(
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _exchangeService: ExchangeService,
    @Inject(INJECTOR) injectorCh: Injector,
    private _router: Router,
    private _matDialog: DialogService
  ) {
    super(injectorCh);
  }

  ngOnInit(): void {
    this.getCompanyTaxValue();
    this.initForm();
    this.billExchangeId = this._activatedRoute.snapshot.params['id'];
    this.billExchangeId ? this.getExchangeDetails() : this.generateExchangeNumber();
    // this.watchTaxValueChange();
    this.watchAmountValueChange();
    this.typePaymentObserver();
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  getCompanyTaxValue() {
    this.getCompanyTax()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.companyTaxValue = res.data;
      });
  }

  // watchTaxValueChange() {
  //   this.billExchangeFrom
  //     .get('tax')
  //     ?.valueChanges.pipe(untilDestroyed(this))
  //     .subscribe(value => {
  //       if (this.billExchangeFrom.get('withTax')?.value && this.companyTaxValue >= 0 && this.companyTaxValue < 100) {
  // taxTypeId
  // const taxType = this.taxTypes.find(type => this.form.get('taxTypeId')?.value === type.id)?.value || 1;
  // const taxAmount = this._taxHandlerService.calcTaxAmount(taxType, rentAmount, 0, +this.companyTaxValue);
  // const withoutTaxAmount = this._taxHandlerService.calcAmountWithoutTax(taxType, rentAmount, 0, taxAmount);
  // const withTaxAmount = taxType == 1 ? rentAmount : taxAmount + rentAmount;
  // if (this.formControls['rentDaysPeriod'].value == null)
  //   this.formControls['rentDaysPeriod'].patchValue(1, { emitEvent: false });
  // const rentAmountTotalWithoutTaxAmount = (
  //   taxType == 1
  //     ? (rentAmount - taxAmount) * this.formControls['rentDaysPeriod'].value
  //     : rentAmount * this.formControls['rentDaysPeriod'].value
  // ).toFixed(2);
  // const rentAmountTotalWithTaxAmount = (withTaxAmount * this.formControls['rentDaysPeriod'].value).toFixed(2);
  // this.billExchangeFrom.patchValue({
  //   totalAmountWithTax: rentAmountTotalWithTaxAmount,
  //   totalAmountWithoutTax: rentAmountTotalWithoutTaxAmount,
  // });
  // }
  //     });
  // }

  watchAmountValueChange() {
    this.billExchangeFrom
      .get('amount')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (this.billExchangeFrom.get('withTax')?.value && this.companyTaxValue >= 0 && this.companyTaxValue < 100) {
          this.billExchangeFrom.get('totalAmountWithTax')?.setValue('');
          this.billExchangeFrom.get('totalAmountWithoutTax')?.setValue('');
        }
      });
  }

  typePaymentObserver() {
    this.billExchangeFrom
      .get('paymentDestinationId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data) {
          this.paymentDisplay = data.value;
        }
      });
  }

  getExchangeDetails() {
    this._exchangeService.getExchangeDetails(this.billExchangeId).subscribe(res => {
      this.billExchangeFrom.patchValue({
        ...res.data,
        withTax: res.data.tax ? true : false,
      });
    });
  }

  initForm() {
    this.billExchangeFrom = this._fb.group({
      billExchangeTypeNumber: [null, Validators.required],
      date: [null, Validators.required],
      // sideTypeId: [null, Validators.required],
      // expenseTypeId: [null, Validators.required],
      paymentDestinationId: [null, Validators.required],
      amount: [null, Validators.required],
      // withTax: [false, Validators.required],
      // tax: [null, Validators.required],
      // taxTypeId: [null, Validators.required],
      // totalAmountWithTax: [null, Validators.required],
      // totalAmountWithoutTax: [null, Validators.required],
      details: [null, Validators.required],
      storeId: [null],
      account: [null],
      bankId: [null],
      transferDate: [null],
      checkNumber: [null],
      benefitDate: [null],
      networkId: [null],
      operationDate: [null],
      operationNumber: [null],
      deviceId: [null],
      exchangeBills: this._fb.array([], [Validators.required]),
    });
  }
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
  }

  generateExchangeNumber() {
    this._exchangeService
      .generateNumber()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.billExchangeFrom.get('billExchangeTypeNumber')?.setValue(res.data);
      });
  }
  openDialogBillsExchange() {
    this._matDialog
      .openDialog(DialogBillsExchangeComponent)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          (this.billExchangeFrom.get('exchangeBills') as FormArray).push(
            this._fb.group({
              amount: res.amount,
              description: res.description,
              sideTypeId: res.sideTypeId?.id || res.sideTypeId,
              expenseTypeId: res.expenseTypeId?.id || res.expenseTypeId,
              taxTypeId: res.taxTypeId?.id || res.taxTypeId,
              customerId: res.customerId?.id || res.customerId,
              employeeId: res.employeeId?.id || res.employeeId,
              officeId: res.officeId?.id || res.officeId,
              accountId: res.accountId?.id || res.accountId,
              contractId: res.contractId?.id || res.contractId,
            })
          );
          this.gridApi.applyTransaction({ add: [res] });
          console.log(this.billExchangeFrom.value);
        }
      });
  }

  addBillExchange() {
    this.isLoading = true;
    const newBillExchangeFrom = {
      ...this.billExchangeFrom.getRawValue(),
      paymentDestinationId:
        this.billExchangeFrom.value.paymentDestinationId?.id || this.billExchangeFrom.value.paymentDestinationId,
      storeId: this.billExchangeFrom.value.storeId?.id || this.billExchangeFrom.value.storeId,
      bankId: this.billExchangeFrom.value.bankId?.id || this.billExchangeFrom.value.bankId,
      networkId: this.billExchangeFrom.value.networkId?.id || this.billExchangeFrom.value.networkId,
    };
    this._exchangeService
      .addExchange(newBillExchangeFrom)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.billExchangeFrom.reset();
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

  updateBillExchange() {
    this.isLoading = true;
    const updatedBillExchangeFrom = {
      ...this.billExchangeFrom.getRawValue(),
      paymentDestinationId:
        this.billExchangeFrom.value.paymentDestinationId?.id || this.billExchangeFrom.value.paymentDestinationId,
      storeId: this.billExchangeFrom.value.storeId?.id || this.billExchangeFrom.value.storeId,
      bankId: this.billExchangeFrom.value.bankId?.id || this.billExchangeFrom.value.bankId,
      networkId: this.billExchangeFrom.value.networkId?.id || this.billExchangeFrom.value.networkId,
    };
    this._exchangeService
      .updateExchange(this.billExchangeId, updatedBillExchangeFrom)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.billExchangeFrom.reset();
          this.rowData = [];
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/bills-exchange/documents-table`);
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}

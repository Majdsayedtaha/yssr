import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { ReceiptGridComponent } from './ag-grid/receipt.grid.component';
import { IBillReceipt } from '../../models/bill-receipt.interface';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptService } from '../../services/receipt.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { NgxNumToWordsService } from 'ngx-num-to-words';
import { TitleCasePipe } from '@angular/common';
import { AppRoutes } from 'src/app/core/constants';
import { IEnum } from 'src/app/core/interfaces';
@UntilDestroy()
@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
  providers: [TitleCasePipe],
})
export class AddBillComponent extends ReceiptGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  receiptForm!: FormGroup;
  isLoading: boolean = false;
  loadingData: boolean = false;
  add: boolean = false;
  receiptId!: string;
  textSuffix!: string;
  gridApi!: GridApi;
  typeSideDisplay!: number;
  typeBoundDisplay!: number;
  paymentDisplay!: number;
  numberInWordsArabic!: string;
  numberInWordsEnglish!: string;
  sidesType: IEnum[] = [];

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _receiptService: ReceiptService,
    private _titleCasePipe: TitleCasePipe,
    private ngxNumToWordsService: NgxNumToWordsService,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.receiptId = this._activatedRoute.snapshot.params['id'];
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
    this.receiptId ? this.getInfo() : this.generateReceiptNumber();
    this.typeBoundObserver();
    this.typePaymentObserver();
    this.textSuffixByType();
    this.amountObserver();
    this.watchBillType();
  }

  onGridReady(params: GridReadyEvent<IBillReceipt>) {
    this.gridApi = params.api;
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
  }

  initForm() {
    this.receiptForm = this._fb.group({
      date: [null, Validators.required],
      receiptNumber: [null, Validators.required],
      amount: [null, [Validators.max(1000000000), Validators.min(0)]],
      amountWritten: [null, [TextValidator.arabic]],
      amountWrittenEn: [null, [TextValidator.english]],
      description: [null, Validators.required],
      transferDate: [null],
      operationDate: [null],
      operationNumber: [null],
      typeId: [null, Validators.required],
      storeId: [null],
      bankId: [null],
      networkId: [null],
      checkNumber: [null],
      benefitDate: [null],
      accountName: [null],
      deviceId: [null],
      billId: [null],
      PaymentDestinationId: [null],
      sideTypeId: [null],
      services: this._fb.array([]),
      // Not from swagger
      customerId: [null],
      employeeId: [null],
      officeId: [null],
    });
  }

  typeBoundObserver() {
    this.receiptForm.get('typeId')?.valueChanges.subscribe(data => {
      if (data) {
        this.typeBoundDisplay = data.value;
        if (data.value === 1) {
          this.receiptForm.get('amount')?.addValidators(Validators.required);
          this.receiptForm.get('amount')?.updateValueAndValidity();
          this.receiptForm.get('amountWritten')?.addValidators(Validators.required);
          this.receiptForm.get('amountWritten')?.updateValueAndValidity();
          this.receiptForm.get('amountWrittenEn')?.addValidators(Validators.required);
          this.receiptForm.get('amountWrittenEn')?.updateValueAndValidity();
        } else {
          this.receiptForm.get('amount')?.removeValidators(Validators.required);
          this.receiptForm.get('amount')?.updateValueAndValidity();
          this.receiptForm.get('amountWritten')?.removeValidators(Validators.required);
          this.receiptForm.get('amountWritten')?.updateValueAndValidity();
          this.receiptForm.get('amountWrittenEn')?.removeValidators(Validators.required);
          this.receiptForm.get('amountWrittenEn')?.updateValueAndValidity();
        }
      }
    });
  }

  amountObserver() {
    this.receiptForm.get('amount')?.valueChanges.subscribe(data => {
      if (data && +data >= 0 && +data <= 1000000000) {
        this.numberInWordsArabic = this.ngxNumToWordsService.inWords(data, 'ar');
        this.numberInWordsEnglish = this._titleCasePipe.transform(this.ngxNumToWordsService.inWords(data, 'en'));

        /** Apply some in Arabic edits on library */
        if (+data >= 1000)
          this.numberInWordsArabic = this.numberInWordsArabic.startsWith('واحد')
            ? this.numberInWordsArabic.slice(4)
            : this.numberInWordsArabic;
        if (+data == 200 || +data == 1200) this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتا', 'مئتان');
        if (+data >= 120 && +data < 100000 && +data % 10 === 0)
          this.numberInWordsArabic = this.numberInWordsArabic.replace('مائة', 'مائة و ');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةواحد', 'مائة و واحد');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةاثنان', 'مائة و اثنان');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةأربعة', 'مائة و أربعة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةخمسة', 'مائة و خمسة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةستة', 'مائة و ستة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةسبعة', 'مائة و سبعة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةثمانية', 'مائة و ثمانية');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةتسعة', 'مائة و تسعة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانعشرون', 'مئتان و عشرون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانخمسون', 'مئتان و خمسون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانثلاثون', 'مئتان و ثلاثون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانأربعون', 'مئتان و أربعون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانخمسون', 'مئتان و خمسون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانستون', 'مئتان و ستون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانسبعون', 'مئتان و سبعون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانثمانون', 'مئتان و ثمانون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانتسعون', 'مئتان و تسعون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانواحد', 'مئتان و واحد');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانثلاثة', 'مئتان و ثلاثة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانأربعة', 'مئتان و أربعة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانستة', 'مئتان و ستة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانسبعة', 'مئتان و سبعة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانثمانية', 'مئتان و ثمانية');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانتسعة', 'مئتان و تسعة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتاناثنان', 'مئتان و اثنان');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مئتانخمسة', 'مئتان و خمسة');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةعشرون', 'مائة و عشرون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةثلاثون', 'مائة و ثلاثون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةأربعون', 'مائة و أربعون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةخمسون ', 'مائة و خمسون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةستون', 'مائة و ستون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةسبعون', 'مائة و سبعون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةثمانون ', 'مائة و ثمانون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('مائةتسعون', 'مائة و تسعون');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('عشرة ألف', 'عشرة آلاف');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('ةثلاثة', 'ة و ثلاثة');
        this.numberInWordsArabic = this.numberInWordsArabic.endsWith(' و ')
          ? this.numberInWordsArabic.slice(0, this.numberInWordsArabic.length - 2)
          : this.numberInWordsArabic;
        this.numberInWordsArabic = this.numberInWordsArabic.replace('و  و', ' و ');
        this.numberInWordsArabic = this.numberInWordsArabic.replace('  ', ' ');
        this.receiptForm.get('amountWritten')?.setValue(this.numberInWordsArabic);
        this.receiptForm.get('amountWrittenEn')?.setValue(this.numberInWordsEnglish);
      } else {
        this.receiptForm.get('amountWritten')?.setValue(null);
        this.receiptForm.get('amountWrittenEn')?.setValue(null);
      }
    });
  }

  typePaymentObserver() {
    this.receiptForm
      .get('PaymentDestinationId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data) {
          this.paymentDisplay = data.value;
        }
      });
  }

  textSuffixByType() {
    this.receiptForm.get('sideTypeId')?.valueChanges.subscribe(data => {
      if (data) {
        this.typeSideDisplay = data.value;
        if (data.value === 3) this.textSuffix = 'dollar_only';
        else this.textSuffix = 'SAR_only';
      }
    });
  }

  watchBillType() {
    this.receiptForm.get('typeId')?.valueChanges.subscribe(data => {
      if (data) {
        if (data.value === 2) {
          this.receiptForm.get('sideTypeId')?.disable();
          if (this.sidesType.length === 0) {
            this.getSideTypes().subscribe(res => {
              this.sidesType = res.data;
              this.receiptForm.get('sideTypeId')?.setValue(this.sidesType[0]);
            });
          } else {
            this.receiptForm.get('sideTypeId')?.setValue(this.sidesType[0]);
          }
        } else {
          this.receiptForm.get('sideTypeId')?.reset();
          this.receiptForm.get('sideTypeId')?.enable();
        }
      }
    });
  }

  generateReceiptNumber() {
    this._receiptService.generateReceiptNumber().subscribe(res => {
      this.receiptForm.get('receiptNumber')?.setValue(res.data);
    });
  }

  getInfo() {
    this._receiptService
      .getReceiptDetails(this.receiptId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.receiptForm.patchValue({
          ...res.data,
          typeId: res.data.type,
          storeId: res.data.store,
          bankId: res.data.bank,
          networkId: res.data.network,
          deviceId: res.data.device,
          billId: res.data.bill,
          PaymentDestinationId: res.data.paymentDestination,
          sideTypeId: res.data.sideType,
          services: res.data.services,
          customerId: res.data.customer,
          employeeId: res.data.employee,
          officeId: res.data.office,
        });
      });
  }

  updateReceipt() {
    const receiptEdit = {
      ...this.receiptForm.getRawValue(),
      sideTypeId: this.receiptForm.get('sideTypeId')?.getRawValue().id
        ? this.receiptForm.get('sideTypeId')?.getRawValue().id
        : this.receiptForm.get('sideTypeId')?.getRawValue(),
      typeId: this.idGetter('typeId'),
      storeId: this.idGetter('storeId'),
      bankId: this.idGetter('bankId'),
      networkId: this.idGetter('networkId'),
      deviceId: this.idGetter('deviceId'),
      billId: this.idGetter('billId'),
      PaymentDestinationId: this.idGetter('PaymentDestinationId'),
      customerId: this.idGetter('customerId'),
      employeeId: this.idGetter('employeeId'),
      officeId: this.idGetter('officeId'),
    };
    this.isLoading = true;
    this._receiptService
      .updateReceipt(this.receiptId, receiptEdit)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.receiptForm.reset();
          this.rowData = [];
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/receipt/documents-table`);
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  idGetter(field: string): string {
    return this.receiptForm.value[field]?.id ? this.receiptForm.value[field].id : this.receiptForm.value[field];
  }

  addReceipt() {
    const newReceipt = {
      ...this.receiptForm.getRawValue(),
      sideTypeId: this.receiptForm.get('sideTypeId')?.getRawValue().id
        ? this.receiptForm.get('sideTypeId')?.getRawValue().id
        : this.receiptForm.get('sideTypeId')?.getRawValue(),
      typeId: this.idGetter('typeId'),
      storage: this.idGetter('storage'),
      storeId: this.idGetter('storeId'),
      bank: this.idGetter('bank'),
      network: this.idGetter('network'),
      device: this.idGetter('device'),
      PaymentDestinationId: this.idGetter('PaymentDestinationId'),
    };
    this.isLoading = true;
    this._receiptService
      .addReceipt(newReceipt)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.receiptForm.reset();
          this.rowData = [];
          this.generateReceiptNumber();
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  addService() {
    (this.receiptForm.get('services') as FormArray).push(
      this._fb.group({
        id: '1',
        salesInvoiceNumber: 'sssssss',
        date: 'sssssss',
        totalAmount: 'sssssss',
        taxValue: 'sssssss',
        net: 'sssssss',
        paidUp: 'sssssss',
        residual: 'sssssss',
        paymentAmount: '1500',
      })
    );
    this.gridApi.applyTransaction({
      add: [
        {
          id: '1',
          salesInvoiceNumber: 'sssssss',
          date: 'sssssss',
          totalAmount: 'sssssss',
          taxValue: 'sssssss',
          net: 'sssssss',
          paidUp: 'sssssss',
          residual: 'sssssss',
          paymentAmount: '1500',
        },
      ],
    });
  }

  removeService() {
    (this.receiptForm.get('services') as FormArray).clear();
    this.gridApi.applyTransaction(
      this.add === true
        ? {
            remove: [
              {
                id: '1',
                salesInvoiceNumber: 'sssssss',
                date: 'sssssss',
                totalAmount: 'sssssss',
                taxValue: 'sssssss',
                net: 'sssssss',
                paidUp: 'sssssss',
                residual: 'sssssss',
                paymentAmount: '1500',
              },
            ],
          }
        : {}
    );
  }

  GetCustomerBills = () => {
    return this.fetchCustomerBills(this.receiptForm.get('customerId')?.value);
  };
}

import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { IBillExchange } from '../../../bills-exchange/models/bill-exchange.interface';
import { PurchasesGridComponent } from './ag-grid/purchases.grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../services/purchases.service';
import { AppRoutes } from 'src/app/core/constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PurchaseReturnService } from '../../../purchases-rebound/services/Purchase-return.service';
import { IEnum } from 'src/app/core/interfaces';
import { BehaviorSubject } from 'rxjs';
import { PurchaseContract } from '../../models/purchase-contract.interface';
@UntilDestroy()
@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent extends PurchasesGridComponent implements OnInit, OnDestroy {
  purchasesForm!: FormGroup;
  isLoading: boolean = false;
  loadingData: boolean = false;
  add: boolean = false;
  purchasesId!: string;
  gridApi!: GridApi;
  billTypes: IEnum[] = [];
  paymentDestinationOptions: IEnum[] = [];
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  private _billTypeValue$ = new BehaviorSubject<number>(-1);
  private _paymentDestinationValue$ = new BehaviorSubject<number>(-1);
  billTypeValue$ = this._billTypeValue$.asObservable();
  paymentDestinationValue$ = this._paymentDestinationValue$.asObservable();

  get f() {
    return this.purchasesForm?.controls;
  }

  get contractsArray() {
    return this._purchaseService.officeContracts.map(contract => {
      return {
        id: contract.id,
        value: contract.refundAmount,
      };
    });
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _purchaseService: PurchaseService,
    private _purchaseReturnService: PurchaseReturnService,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.purchasesId = this._activatedRoute.snapshot.params['id'];
    this.watchBillType();
    this.watchPaymentDestination();
    this.watchExternalOffices();
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
    this.loadingData = true;
    this.getBillTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.billTypes = res.data;
        this.getPaymentDestinations()
          .pipe(untilDestroyed(this))
          .subscribe(res => {
            this.paymentDestinationOptions = res.data;
            if (this.purchasesId) this.getPurchaseInfo();
            else this.generatePurchaseNumber();
          });
      });
  }

  onGridReady(params: GridReadyEvent<IBillExchange>) {
    this.gridApi = params.api;
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getOfficeContracts();
  }

  initForm() {
    this.purchasesForm = this._fb.group({
      purchaseNumber: [null, Validators.required],
      date: [null, Validators.required],
      externalOfficeId: [null, Validators.required],
      typeId: [null],
      paymentDestinationId: [null],
      storeId: [null],
      bankId: [null],
      dateTransfer: [null],
      checkNumber: [null],
      checkDueDate: [null],
      networkId: [null],
      contracts: this._fb.array([]),
    });
  }

  watchBillType() {
    this.purchasesForm
      .get('typeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(valueChanges => {
        if (valueChanges) {
          const value = this.billTypes?.find(r => r.id === (valueChanges.id || valueChanges))?.value || -1;
          this._billTypeValue$.next(value);
        } else {
          this._billTypeValue$.next(-1);
        }
      });
  }

  watchPaymentDestination() {
    this.purchasesForm
      .get('paymentDestinationId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(valueChanges => {
        if (valueChanges) {
          const value =
            this.paymentDestinationOptions?.find(r => r.id === (valueChanges.id || valueChanges))?.value || -1;
          this._paymentDestinationValue$.next(value);
        } else {
          this._paymentDestinationValue$.next(-1);
        }
      });
  }

  watchExternalOffices() {
    this.purchasesForm
      .get('externalOfficeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.getOfficeContracts();
      });
  }

  getOfficeContracts() {
    const value = this.purchasesForm.get('externalOfficeId')?.value;
    const id = value?.id ? value.id : value;
    if (id)
      this._purchaseReturnService.getContractsForPurchases(id, this.paginationOptions).subscribe(res => {
        const list: PurchaseContract[] = res.data.list;
        this.fillSavedRefundAmounts(list, this._purchaseService.officeContracts);
        this.rowData = list;
        this.paginationOptions = { ...res.data.pagination, pageSize: 10 };
        if (this.rowData?.length > 0) {
          this.rowData.forEach((data: any) => {
            (this.purchasesForm.get('contracts') as FormArray).push(this._fb.group(data));
          });
        }
      });
  }

  fillSavedRefundAmounts(array1: PurchaseContract[], array2: PurchaseContract[]): void {
    const idMap = new Map<string, number>();
    for (const item of array2) {
      idMap.set(item.id, item.refundAmount);
    }

    for (let i = 0; i < array1.length; i++) {
      const currentId = array1[i].id;
      if (idMap.has(currentId)) {
        array1[i].refundAmount = idMap.get(currentId)!;
      }
    }
  }

  generatePurchaseNumber() {
    this._purchaseService.generatePurchaseNumber().subscribe(res => {
      this.purchasesForm.get('purchaseNumber')?.setValue(res.data);
      this.loadingData = false;
    });
  }

  getPurchaseInfo() {
    this._purchaseService.getPurchaseDetails(this.purchasesId).subscribe(res => {
      this.purchasesForm.patchValue({
        purchaseNumber: res.data.list.info.purchaseNumber,
        date: res.data.list.info.date,
        externalOfficeId: res.data.list.info.externalOffice,
        checkNumber: res.data.list.info.checkNumber,
        checkDueDate: res.data.list.info.checkDueDate,
        typeId: res.data.list.info.type,
        paymentDestinationId: res.data.list.info.paymentDestination,
        storeId: res.data.list.info.store,
        bankId: res.data.list.info.bank,
        networkId: res.data.list.info.network,
      });
      this.rowData = res.data.list.list;
      this.paginationOptions = { ...res.data.pagination, pageSize: 10 };
      if (this.rowData.length > 0) {
        this.rowData.forEach((data: any) => {
          (this.purchasesForm.get('contracts') as FormArray).push(this._fb.group(data));
        });
      }
      this.loadingData = false;
    });
  }

  updatePurchases() {
    const contracts = this.contractsArray;
    const updateForm = {
      ...this.purchasesForm.getRawValue(),
      paymentDestinationId:
        this.purchasesForm.value.paymentDestinationId?.id || this.purchasesForm.value.paymentDestinationId,
      storeId: this.purchasesForm.value.storeId?.id || this.purchasesForm.value.storeId,
      bankId: this.purchasesForm.value.bankId?.id || this.purchasesForm.value.bankId,
      networkId: this.purchasesForm.value.networkId?.id || this.purchasesForm.value.networkId,
      contracts: contracts,
    };
    this.isLoading = true;
    this._purchaseService.updatePurchase(this.purchasesId, updateForm).subscribe({
      next: res => {
        this.isLoading = false;
        this.rowData = [];
        this._purchaseService.officeContracts = [];
        this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/purchases/bills-table`);
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  addPurchases() {
    const contracts = this.contractsArray;
    const newPurchases = {
      ...this.purchasesForm.getRawValue(),
      paymentDestinationId:
        this.purchasesForm.value.paymentDestinationId?.id || this.purchasesForm.value.paymentDestinationId,
      storeId: this.purchasesForm.value.storeId?.id || this.purchasesForm.value.storeId,
      bankId: this.purchasesForm.value.bankId?.id || this.purchasesForm.value.bankId,
      networkId: this.purchasesForm.value.networkId?.id || this.purchasesForm.value.networkId,
      contracts: contracts,
    };
    this.isLoading = true;
    this._purchaseService.addPurchase(newPurchases).subscribe({
      next: res => {
        this.isLoading = false;
        this.purchasesForm.reset();
        this.rowData = [];
        this._purchaseService.officeContracts = [];
        this.generatePurchaseNumber();
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  override ngOnDestroy(): void {
    this._purchaseService.officeContracts = [];
  }
}

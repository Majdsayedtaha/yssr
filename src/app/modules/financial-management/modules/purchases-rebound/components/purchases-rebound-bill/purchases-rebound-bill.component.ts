import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseReturnService } from '../../services/Purchase-return.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ColDef, GridApi, GridReadyEvent, RowSelectedEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { AppRoutes } from 'src/app/core/constants';
import { PurchaseContract } from '../../../purchases/models/purchase-contract.interface';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IEnum } from 'src/app/core/interfaces';
@UntilDestroy()
@Component({
  selector: 'app-purchases-rebound-bill',
  templateUrl: './purchases-rebound-bill.component.html',
  styleUrls: ['./purchases-rebound-bill.component.scss'],
})
export class PurchasesReboundBillComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  purchasesReturnId!: string;
  isLoading: boolean = false;
  gridApi!: GridApi;
  rowData: any[] = [];
  columnDefs: ColDef[] = [];
  paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  purchasesReturnFrom!: FormGroup;
  loadingData: boolean = false;
  billTypes: IEnum[] = [];
  paymentDestinationOptions: IEnum[] = [];
  private _billTypeValue$ = new BehaviorSubject<number>(-1);
  private _paymentDestinationValue$ = new BehaviorSubject<number>(-1);
  billTypeValue$ = this._billTypeValue$.asObservable();
  paymentDestinationValue$ = this._paymentDestinationValue$.asObservable();

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _purchaseReturnService: PurchaseReturnService,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.purchasesReturnId = this._activatedRoute.snapshot.params['id'];
    this.watchBillType();
    this.watchPaymentDestination();
    this.watchOfficeForDisplayBills();
    this.loadingData = true;
    this.getBillTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.billTypes = res.data;
        this.getPaymentDestinations()
          .pipe(untilDestroyed(this))
          .subscribe(res => {
            this.paymentDestinationOptions = res.data;
            if (this.purchasesReturnId) this.getPurchaseReturnDetails();
            else this.generatePurchaseReturnNumber();
          });
      });
    this.colDefs();
    this.gridOptions = {
      ...this.gridOptions,
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      context: { parentComp: this },
    };
  }

  colDefs() {
    this.columnDefs = [
      {
        headerName: 'table.purchases.contract_number',
        field: 'requestNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'table.purchases.contract_date',
        field: 'date',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.customer',
        field: 'customer',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.worker',
        field: 'worker',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.purchases.benefit_number',
        field: 'amount',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
    ];
  }

  initForm() {
    this.purchasesReturnFrom = this._fb.group({
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

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }

  onRowSelected(e: RowSelectedEvent) {
    if (e.source === 'rowClicked' || e.source === 'checkboxSelected' || e.source === 'uiSelectAll') {
      const contracts = this._purchaseReturnService.officeContracts;
      if (e.node.isSelected()) contracts.push(e.node.data);
      else {
        const index = contracts.findIndex(c => c.id === e.data.id);
        if (index > -1) contracts.splice(index, 1);
      }
    }
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getContractsForPurchases();
  }

  getPurchaseReturnDetails() {
    this._purchaseReturnService.getPurchaseReturnDetails(this.purchasesReturnId).subscribe(res => {
      const details = res.data.list.info;
      this.purchasesReturnFrom.patchValue({
        ...details,
        typeId: details.type,
        externalOfficeId: details.externalOffice,
        storeId: details?.store,
        bankId: details?.bank,
        networkId: details?.network,
        paymentDestinationId: details?.paymentDestination,
      });
      this.loadingData = false;
    });
  }

  watchBillType() {
    this.purchasesReturnFrom
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
    this.purchasesReturnFrom
      .get('paymentDestinationId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(valueChanges => {
        if (valueChanges) {
          if (!this.loadingData)
            ['storeId', 'bankId', 'dateTransfer', 'checkNumber', 'checkDueDate', 'networkId'].forEach(control =>
              this.purchasesReturnFrom.get(control)?.reset(null, { emitEvent: false })
            );
          const value =
            this.paymentDestinationOptions?.find(r => r.id === (valueChanges.id || valueChanges))?.value || -1;
          this._paymentDestinationValue$.next(value);
        } else {
          this._paymentDestinationValue$.next(-1);
        }
      });
  }

  watchOfficeForDisplayBills() {
    this.purchasesReturnFrom.get('externalOfficeId')?.valueChanges.subscribe(value => {
      this.getContractsForPurchases();
    });
  }

  getContractsForPurchases() {
    const value = this.purchasesReturnFrom.get('externalOfficeId')?.value;
    const externalOfficeId = value?.id ?? value;
    if (externalOfficeId) {
      this._purchaseReturnService.getContractsForPurchases(externalOfficeId, this.paginationOptions).subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
        setTimeout(() => {
          this.setSavedRowsAsSelected(this.rowData, this._purchaseReturnService.officeContracts);
        }, 0);
        if (this.rowData?.length > 0) {
          this.rowData.forEach((data: any) => {
            (this.purchasesReturnFrom.get('contracts') as FormArray).push(this._fb.group(data));
          });
        }
      });
    }
  }

  setSavedRowsAsSelected(array1: PurchaseContract[], array2: PurchaseContract[]): void {
    const idMap = new Map<string, boolean>();
    for (let i = 0; i < array2.length; i++) {
      idMap.set(array2[i].id, true);
    }
    for (let i = 0; i < array1.length; i++) {
      const currentId = array1[i].id;
      if (idMap.has(currentId)) {
        this.gridApi.getDisplayedRowAtIndex(i)?.setSelected(idMap.get(currentId)!);
      }
    }
  }

  generatePurchaseReturnNumber() {
    this._purchaseReturnService.generatePurchaseReturnNumber().subscribe(res => {
      this.purchasesReturnFrom.get('purchaseNumber')?.setValue(res.data);
      this.loadingData = false;
    });
  }

  addPurchasesReturn() {
    this.isLoading = true;
    const dataToPost = {
      ...this.purchasesReturnFrom.getRawValue(),
      contracts: this._purchaseReturnService.officeContracts.map(c => {
        return { id: c.id, value: c.amount };
      }),
    };
    this._purchaseReturnService.addPurchaseReturn(dataToPost).subscribe({
      next: res => {
        this.isLoading = false;
        this.purchasesReturnFrom.reset();
        this.generatePurchaseReturnNumber();
        this.rowData = [];
        this._purchaseReturnService.officeContracts = [];
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  updatePurchasesReturn() {
    const dataToPut = {
      ...this.purchasesReturnFrom.getRawValue(),
      contracts: this._purchaseReturnService.officeContracts.map(c => {
        return { id: c.id, value: c.amount };
      }),
    };
    this._purchaseReturnService.updatePurchaseReturn(this.purchasesReturnId, dataToPut).subscribe({
      next: res => {
        this.purchasesReturnFrom.reset();
        this.rowData = [];
        this._purchaseReturnService.officeContracts = [];
        this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/purchases-rebound/bills-table`);
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
    this._purchaseReturnService.officeContracts = [];
  }
}

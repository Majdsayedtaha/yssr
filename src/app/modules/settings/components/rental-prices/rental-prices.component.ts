import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { RentalPriceActionCell } from './agGrid/custom-cell/rental-price-action.cell';
import { RentPriceService } from '../../services/rent-price.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, of, mergeMap } from 'rxjs';
import { IRentPrice } from '../../models';
import { DialogRentPriceComponent } from './dialog-rent-price/dialog-rent-price.component';
import { DialogService } from 'src/app/core/services/dialog.service';
@UntilDestroy()
@Component({
  selector: 'app-rental-prices',
  templateUrl: './rental-prices.component.html',
  styleUrls: ['./rental-prices.component.scss'],
})
export class RentalPricesComponent extends CoreBaseComponent implements OnInit {
  public columnDefs: ColDef[] = [];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  rentPriceForm!: FormGroup;
  gridApi!: GridApi;
  isLoading: boolean = false;
  rentPriceCountry!: IRentPrice | null;
  rentPrice!: IRentPrice;
  copyRentPricesFormValue!: any;
  copyRentPricesCountry!: IRentPrice | null;
  update = false;

  get pricesArray() {
    return this.rentPriceForm.get('prices') as FormArray;
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _rentPriceService: RentPriceService,
    public matDialog:DialogService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.initColDef();
    this.getCountryRentPrices();
  }

  buildForm() {
    this.rentPriceForm = this._fb.group({
      mainData: this._fb.group({
        countryId: [null, Validators.required],
        jobId: [null, Validators.required],
      }),
      priceData: this._fb.group({
        id: ['id_' + crypto.randomUUID()],
        rentTypeId: [null, Validators.required],
        price: [null, Validators.required],
      }),
      prices: this._fb.array([]),
    });
  }

  formGroup(name: string) {
    return this.rentPriceForm.get(name) as FormGroup;
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.rent_type',
        field: 'rentType.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.rentTypeId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.salary',
        field: 'price',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: RentalPriceActionCell,
        cellRendererParams: {
          formGroup: this.rentPriceForm,
        },
      },
    ];
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridApi?.setRowData([]);
  }

  getCountryRentPrices() {
    (this.rentPriceForm.get('mainData') as FormGroup).valueChanges
      .pipe(
        untilDestroyed(this),
        switchMap(value => {
          if (value['countryId'] == null || value['jobId'] == null) {
            return of(null);
          }
          return this._rentPriceService
            .getCountryWithJobRentSalePrices({ id: value['countryId'], jobId: value['jobId'] })
            .pipe(
              mergeMap(res => {
                return of(res.data);
              })
            );
        })
      )
      .subscribe(res => {
        if (!res) {
          this.rentPriceCountry = null;
          this.rentPriceForm.get('priceData')?.markAsUntouched();
        }
        this.rentPriceCountry = res;
        this.copyRentPricesCountry = res;

        this.pricesArray?.clear();
        res?.prices.forEach((p: any) => {
          this.pricesArray.push(
            this._fb.group({
              id: p.id,
              price: +p.price,
              rentTypeId: p.rentType?.id,
            })
          );
        });
        this.takeCopy();
      });
  }

  saveRentPrice() {
    if (!this.rentPrice) {
      this.rentPrice = {
        countryId: this.formGroup('mainData').value.countryId,
        jobId: this.formGroup('mainData').value.jobId,
        prices: this.rentPriceForm.get('prices')?.value || [],
      };
    } else {
      const prices = this.rentPriceForm.get('prices')?.value;
      for (let i = 0; i < prices?.length; i++) {
        if (typeof prices[i].rentTypeId === 'object') {
          prices[i].rentTypeId = prices[i].rentTypeId.id;
        }
        prices[i].price = +prices[i].price;
        delete prices[i].id;
      }
      this.rentPrice['prices'] = prices;
    }
    this.isLoading = true;
    this._rentPriceService.addCountryRentPrices(this.rentPrice).subscribe({
      next: () => {
        this.isLoading = false;
        this.takeCopy();
        this.rentPriceForm.reset();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  takeCopy() {
    this.copyRentPricesFormValue = this.rentPriceForm.value;
  }

  watchIfDataNeedToClear(event: boolean) {
    if (event) {
      this.rentPriceForm.setValue(this.copyRentPricesFormValue);
      this.rentPriceCountry = this.copyRentPricesCountry;
    } else {
      this.rentPriceCountry = null;
      this.rentPriceForm.get('priceData')?.reset();
      this.rentPriceForm.get('prices')?.reset();
      this.rentPriceForm.get('mainData')?.patchValue({
        jobId: null,
      });
      this.rentPriceForm.get('priceData')?.markAsUntouched();
    }
  }

  addRecord() {
    this.update = false;
    this.formGroup('priceData').reset({ id: 'id_' + crypto.randomUUID() });
    const dialogRef = this.matDialog.openDialog(DialogRentPriceComponent, {
      data: { priceForm: this.formGroup('priceData') },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res && !this.update) {
          this.gridApi.applyTransaction({ add: [res.priceForm.value] });
          this.pricesArray.push(this._fb.group(JSON.parse(JSON.stringify(res.priceForm.value))));
          this.rentPrice = {
            countryId: this.formGroup('mainData').value.countryId,
            jobId: this.formGroup('mainData').value.jobId,
            prices: this.rentPriceForm.get('prices')?.value,
          };
        }
      },
    });
  }
}

import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { mergeMap, of, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SalesPriceActionCell } from './agGrid/custom-cell/sales-price-action.cell';
import { SalePriceService } from '../../services/sale-price.service';
import { ISalePrice } from '../../models';
import { DialogSalePriceComponent } from './dialog-sale-price/dialog-sale-price.component';
import { IEnum } from 'src/app/core/interfaces';
import { IRoleEnum } from 'src/app/core/constants';
import { DialogService } from 'src/app/core/services/dialog.service';

@UntilDestroy()
@Component({
  selector: 'app-sales-prices',
  templateUrl: './sales-prices.component.html',
  styleUrls: ['./sales-prices.component.scss'],
})
export class SalesPricesComponent extends CoreBaseComponent implements OnInit {
  public gridApi!: GridApi;
  public salePrice!: ISalePrice;
  public update: boolean = false;
  public columnDefs: ColDef[] = [];
  public salesPriceForm!: FormGroup;
  public isLoading: boolean = false;
  public role = IRoleEnum.SalePrice;
  public copySalesPriceFormValue!: any;
  public salePriceCountry!: ISalePrice | null;
  public copySalePriceCountry!: ISalePrice | null;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  get pricesArray() {
    return this.salesPriceForm.get('prices') as FormArray;
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _salesPriceService: SalePriceService,
    public matDialog: DialogService
  ) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    //TODO: FilterSale
    // this.subjectSub = this.subject
    //   ?.pipe(
    //     untilDestroyed(this),
    //     debounceTime(500),
    //     switchMap(res => {
    //       return this.getList(res)?.pipe(
    //         catchError(res => {
    //           return of([]);
    //         })
    //       );
    //     }),
    //     catchError(res => {
    //       return of([]);
    //     })
    //   )
    //   .subscribe((res: any) => {
    //   });

    this.buildForm();
    this.initColDef();
    this.getCountrySalePrices();
  }

  buildForm() {
    this.salesPriceForm = this._fb.group({
      mainData: this._fb.group({
        countryId: [null, Validators.required],
        recruitmentPeriod: [null, Validators.required],
        recruitmentSalary: [null, Validators.required],
      }),
      priceData: this._fb.group({
        id: ['id_' + crypto.randomUUID()],
        jobId: [null, Validators.required],
        experienceTypeId: [null, Validators.required],
        religionId: [null, Validators.required],
        monthlySalary: [null],
        price: [null, Validators.required],
      }),
      prices: this._fb.array([]),
    });
  }

  formGroup(name: string) {
    return this.salesPriceForm.get(name) as FormGroup;
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.career',
        field: 'job.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.jobId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.experienceType',
        field: 'experienceType.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.experienceTypeId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.religion',
        field: 'religion.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.religionId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      // {
      //   headerName: 'setting.fields.salary',
      //   field: 'monthlySalary',
      //   flex: 1,
      //   filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      // },
      {
        headerName: 'setting.fields.price',
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
        cellRenderer: SalesPriceActionCell,
        cellRendererParams: {
          formGroup: this.salesPriceForm,
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

  getCountrySalePrices() {
    this.salesPriceForm
      .get('mainData')
      ?.get('countryId')
      ?.valueChanges.pipe(
        untilDestroyed(this),
        switchMap(value => {
          if (!value) {
            return of(null);
          }
          return this._salesPriceService.getCountrySalePrices(value).pipe(
            mergeMap(res => {
              return of(res.data);
            })
          );
        })
      )
      .subscribe(res => {
        if (!res) {
          this.salePriceCountry = null;
          this.salesPriceForm.get('priceData')?.markAsUntouched();
        }
        this.salePriceCountry = res;
        this.copySalePriceCountry = res;

        this.formGroup('mainData').patchValue({
          recruitmentPeriod: this.salePriceCountry?.recruitmentPeriod,
          recruitmentSalary: this.salePriceCountry?.recruitmentSalary,
        });
        this.pricesArray?.clear();
        res?.prices.forEach(p => {
          this.pricesArray.push(
            this._fb.group({
              id: p.id,
              religionId: p.religion?.id,
              jobId: p.job?.id,
              experienceTypeId: p.experienceType?.id,
              // monthlySalary: +p.monthlySalary,
              price: +p.price,
            })
          );
        });
        this.takeCopy();
      });
  }

  saveSalePrice() {
    if (!this.salePrice) {
      this.salePrice = {
        countryId: this.formGroup('mainData').value.countryId,
        recruitmentPeriod: +this.formGroup('mainData').value.recruitmentPeriod,
        recruitmentSalary: +this.formGroup('mainData').value.recruitmentSalary,
        prices: this.pricesArray?.value || [],
      };
    } else {
      const prices = this.formGroup('prices').value;
      for (let i = 0; i < prices?.length; i++) {
        if (typeof prices[i].religionId === 'object') {
          prices[i].religionId = (prices[i].religionId as IEnum).id as string;
          prices[i].jobId = (prices[i].jobId as IEnum).id as string;
          prices[i].experienceTypeId = (prices[i].experienceTypeId as IEnum).id as string;
        }
        // prices[i].monthlySalary = +prices[i].monthlySalary;
        prices[i].price = +prices[i].price;
        delete prices[i].id;
      }
      this.salePrice['prices'] = prices;
      this.salePrice.countryId = this.formGroup('mainData').value.countryId;
      this.salePrice.recruitmentPeriod = +this.formGroup('mainData').value.recruitmentPeriod;
      this.salePrice.recruitmentSalary = +this.formGroup('mainData').value.recruitmentSalary;
    }
    this.isLoading = true;
    this._salesPriceService.addCountrySalePrices(this.salePrice).subscribe({
      next: () => {
        this.isLoading = false;
        this.takeCopy();
        this.salesPriceForm.reset();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  takeCopy() {
    this.copySalesPriceFormValue = this.salesPriceForm.value;
  }

  watchIfDataNeedToClear(event: boolean) {
    if (event) {
      this.salesPriceForm.setValue(this.copySalesPriceFormValue);
      this.salePriceCountry = this.copySalePriceCountry;
    } else {
      this.salePriceCountry = null;
      this.salesPriceForm.get('priceData')?.reset();
      this.salesPriceForm.get('prices')?.reset();
      this.salesPriceForm.get('mainData')?.patchValue({
        recruitmentPeriod: null,
        recruitmentSalary: null,
      });
      this.salesPriceForm.get('mainData')?.markAsUntouched();
    }
  }

  addRecord() {
    this.update = false;
    this.formGroup('priceData').reset({ id: 'id_' + crypto.randomUUID() });
    const recruitmentSalary = this.formGroup('mainData').controls['recruitmentSalary'].value;
    this.formGroup('priceData').patchValue({ price: recruitmentSalary });
    const dialogRef = this.matDialog.openDialog(DialogSalePriceComponent, {
      data: { priceForm: this.formGroup('priceData'), update: this.update },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res && !this.update) {
          this.gridApi.applyTransaction({ add: [res.priceForm.value] });
          this.pricesArray.push(this._fb.group(JSON.parse(JSON.stringify(res.priceForm.value))));
          this.salePrice = {
            countryId: this.formGroup('mainData').value.countryId,
            recruitmentPeriod: this.formGroup('mainData').value.recruitmentPeriod,
            recruitmentSalary: this.formGroup('mainData').value.recruitmentSalary,
            prices: this.pricesArray?.value,
          };
        }
      },
    });
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;

    //TODO: FilterSale
    // return this._salesPriceService.getCountrySalePrices().pipe(
    //   tap(res => {
    //     // this.rowData = res.data.list;
    //     // this.gridOptions?.api?.setRowData(this.customerListData);
    //   }),
    //   catchError(res => {
    //     return of([]);
    //   })
    // );
  }
}

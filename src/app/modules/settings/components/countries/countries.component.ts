import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { ICountry } from '../../models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { CountryActionCell } from './ag-grid/custom-cells/country-action.cell';
import { CountryService } from '../../services/country.service';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRoleEnum } from 'src/app/core/constants';

@UntilDestroy()
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent extends CoreBaseComponent implements OnInit {
  public gridApi!: GridApi;
  public columnDefs!: ColDef[];
  public role = IRoleEnum.Country;
  public countryData!: ICountry;
  public countryForm!: FormGroup;
  public update: boolean = false;
  public isLoading: boolean = false;
  public countryDataList!: ICountry[];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder, private _countryService: CountryService) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.countryForm = this._fb.group({
      id: [null],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      nationalityNameAr: [null, [TextValidator.arabic, Validators.required]],
      nationalityNameEn: [null, [TextValidator.english, Validators.required]],
      arrivalDestination: [null, [Validators.required]],
    });

    this.initColDef();

    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => {
          return this.getList(res)?.pipe(
            catchError(res => {
              return of([]);
            })
          );
        }),
        catchError(res => {
          return of([]);
        })
      )
      .subscribe((res: any) => {});
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.country_ar',
        field: 'nameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.country_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.description_ar',
        field: 'nationalityNameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.description_en',
        field: 'nationalityNameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.destination_arrival',
        field: 'arrivalDestination',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: CountryActionCell,
        cellRendererParams: {
          formGroup: this.countryForm,
        },
      },
    ];
  }

  onGridReady(params: GridReadyEvent<ICountry>) {
    this.gridApi = params.api;
    this.getCountries();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getCountries();
  }

  getCountries() {
    this._countryService.getCountries({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.countryDataList = res.data.list;
      this.paginationOptions = res.data.pagination;
      this.processingCSV(this.countryDataList);
    });
  }

  countryRow(type: 'add' | 'update') {
    if (!this.countryForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._countryService.addCountry(this.countryForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.countryForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._countryService.updateCountry(this.countryForm.value['id'], this.countryForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.getRowNode(this.countryForm.value['id'])?.setData(res.data);
          this.gridApi.applyTransaction({ update: [res.data] });
          this.countryForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._countryService.getCountries({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.countryDataList = res.data.list;
        this.gridOptions?.api?.setRowData(this.countryDataList);
        this.processingCSV(this.countryDataList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._countryService.getCountries({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: ICountry[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);

    return tableData.map(
      (record: ICountry) =>
        <ICountry>{
          nameAr: record.nameAr || '',
          nameEn: record.nameEn || '',
          nationalityNameAr: record.nationalityNameAr || '',
          nationalityNameEn: record.nationalityNameEn || '',
        }
    );
  }
}

import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { IArrivalAirport } from '../../models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ArrivalAirportService } from '../../services/arrival-airport.service';
import { ArrivalAirportActionCell } from './ag-grid/custom-cell/arrival-airport-action.cell';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-arrival-airports',
  templateUrl: './arrival-airports.component.html',
  styleUrls: ['./arrival-airports.component.scss'],
})
export class ArrivalAirportsComponent extends CoreBaseComponent implements OnInit {
  public columnDefs: ColDef[] = [];
  arrivalStationDataList!: IArrivalAirport[];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  arrivalStationData!: IArrivalAirport;
  airportForm!: FormGroup;
  gridApi!: GridApi;
  isLoading: boolean = false;
  update: boolean = false;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _arrivalAirportService: ArrivalAirportService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.airportForm = this._fb.group({
      id: [null],
      cityId: [null, Validators.required],
      region: [null, Validators.required],
      nameEn: [null, [TextValidator.english, Validators.required]],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
    });
    this.initColDef();
    this.onChangeRegion();

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
      .subscribe((res: any) => { });
  }
  initColDef() {
    this.columnDefs = [
      {
        headerName: 'city',
        field: 'city.name',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'region',
        field: 'region.name',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.airport_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.airport_ar',
        field: 'nameAr',
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
        cellRenderer: ArrivalAirportActionCell,
        cellRendererParams: {
          formGroup: this.airportForm,
        },
      },
    ];
  }

  onChangeRegion() {
    this.airportForm
      .get('region')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.airportForm.get('cityId')?.reset(null);
      });
  }

  getRegionCitiesSettings = (value?: string, page?: number) => {
    const regId = this.airportForm.get('region')?.value;
    if (regId) return this.getRegionCities(regId, value, page);
    else return of([]);
  };

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getArrivalAirports();
  }

  onGridReady(params: GridReadyEvent<IArrivalAirport>) {
    this.gridApi = params.api;
    this.getArrivalAirports();
  }

  getArrivalAirports() {
    this._arrivalAirportService.getArrivalAirports({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.arrivalStationDataList = res.data.list;
      this.paginationOptions = res.data.pagination;
    });
  }

  arrivalStationRow(type: 'add' | 'update') {
    if (!this.airportForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      const airport = {
        nameAr: this.airportForm.value['nameAr'],
        nameEn: this.airportForm.value['nameEn'],
        cityId: this.airportForm.value['cityId'],
      };
      this._arrivalAirportService.addArrivalAirport(airport).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.airportForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      const airport = {
        nameAr: this.airportForm.value['nameAr'],
        nameEn: this.airportForm.value['nameEn'],
        cityId: this.airportForm.value['cityId'],
      };
      this._arrivalAirportService.updateArrivalAirport(this.airportForm.value['id'], airport).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.getRowNode(this.airportForm.value['id'])?.setData(res.data);
          this.gridApi.applyTransaction({ update: [res.data] });
          this.airportForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._arrivalAirportService.getArrivalAirports({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.arrivalStationDataList = res.data.list;
        this.gridOptions?.api?.setRowData(this.arrivalStationDataList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}

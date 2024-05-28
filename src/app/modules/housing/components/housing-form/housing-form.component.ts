import { finalize, of } from 'rxjs';
import { Location } from '@angular/common';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';
import { AppRoutes } from 'src/app/core/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IApartment, IHousing, IHousingFormData } from '../../models';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseWorkerActionsCellComponent } from '../grid/house-worker-more-actions-cell/house-worker-more-actions-cell.component';

@UntilDestroy()
@Component({
  selector: 'app-housing-form',
  templateUrl: './housing-form.component.html',
  styleUrls: ['./housing-form.component.scss'],
})
export class HousingFormComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  //Decorates
  public form!: FormGroup;
  public housingId!: string;
  public workers: IEnum[] = [];
  public customers: IEnum[] = [];
  public loading: boolean = false;
  public apartmentForm!: FormGroup;
  public isUpdated: boolean = false;
  public loadingData: boolean = false;
  public isUpdatedApartment: boolean = false;
  //AgGrid
  public gridApi!: GridApi;
  public columnDefs: ColDef[] = [];
  public selectedApartmentIdx: number = 0;
  public apartmentList: IApartment[] = [];
  //#endregion

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    public location: Location,
    @Inject(INJECTOR) injector: Injector,
    private _housingService: HousingService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.housingId = this._activatedRoute.snapshot.params['id'];
    this.initialForm();
    this.initialApartmentForm();
    this.initColDef();

    if (this.housingId) {
      this.isUpdated = true;
      this.fetchHousingDetails(this.housingId);
    } else {
      this.isUpdated = false;
    }
    this.onChangeRegion();
  }

  //#region AgGrid

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'field.housing.apartment.unitNumber',
        field: 'unitNumber',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.housing.apartment.roomsCount',
        field: 'roomsCount',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'field.housing.apartment.workerCapacity',
        field: 'workerCapacity',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        flex: 1,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: HouseWorkerActionsCellComponent,
        cellRendererParams: {
          formGroup: this.apartmentForm,
        },
      },
    ];
  }

  onGridReady(params: GridReadyEvent<IApartment>) {
    this.gridApi = params.api;
    this.gridOptions?.api?.setRowData(this.apartmentList);
  }
  //#endregion

  //#region Form
  initialForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      street: [null, [Validators.required, TextValidator.arabic]],
      streetEn: [null, [Validators.required, TextValidator.english]],
      district: [null, [Validators.required, Validators.maxLength(100), TextValidator.arabic]],
      districtEn: [null, [Validators.required, Validators.maxLength(100), TextValidator.english]],
      cityId: [null, Validators.required],
      region: [null, Validators.required],
      postalCode: [null, Validators.required],
      additionalCode: [null, Validators.nullValidator],
      unitNumber: [null, Validators.required],
      buildingNumber: [null, Validators.required],
      location: [null, Validators.required],
    });
  }

  initialApartmentForm() {
    this.apartmentForm = this.fb.group({
      id: [crypto.randomUUID(), Validators.required],
      unitNumber: [null, Validators.required],
      roomsCount: [null, Validators.required],
      workerCapacity: [null, [Validators.required, Validators.maxLength(100)]],
      supervisorsIds: this.fb.array([]),
    });
  }

  onChangeRegion() {
    this.form
      .get('region')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.form.get('cityId')?.reset(null);
      });
  }

  getRegionCitiesSettings = (value?: string, page?: number) => {
    const regId = this.form.get('region')?.value;
    if (regId) return this.getRegionCities(regId, value, page);
    else return of([]);
  };

  fillFormData(housing: IHousingFormData) {
    this.form.patchValue({
      name: housing.name,
      street: housing.street,
      streetEn: housing.streetEn,
      district: housing.district,
      districtEn: housing.districtEn,
      region: housing.region,
      cityId: housing.city,
      postalCode: housing.postalCode,
      additionalCode: housing.additionalCode,
      unitNumber: housing.unitNumber,
      buildingNumber: housing.buildingNumber,
      location: housing.location,
    });
    this.apartmentList = housing.apartments;
    this.apartmentList.forEach(
      (apartment, idx) => (this.apartmentList[idx].supervisorsIds = apartment.supervisors as IEnum[])
    );
    this.gridApi.setRowData(housing.apartments);
    this.isUpdatedApartment = false;
  }

  fillApartmentForm(apartment: IApartment) {
    this.form.patchValue({
      id: apartment.id ?? crypto.randomUUID(),
      unitNumber: apartment.unitNumber,
      roomsCount: apartment.roomsCount,
      workerCapacity: apartment.workerCapacity,
      supervisorsIds: apartment.supervisors?.map((supervisor: IEnum | string) => (supervisor as IEnum)?.id) as string[],
    });
  }
  //#endregion

  //#region Fetch
  fetchHousingDetails(housingId: string) {
    this.loadingData = true;
    this._housingService
      .infoHousing(housingId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IHousingFormData | IHousing>) => {
        this.loadingData = false;
        this.fillFormData(response.data as IHousingFormData);
      });
  }

  getEmployeesSelect = () => {
    return this.fetchEmployeesSelect(null, null, 9);
  };
  //#endregion

  // #region Actions
  submit() {
    if (this.form.valid) {
      this.form?.removeControl('region');
      this.form?.updateValueAndValidity();
      this.loading = true;
      const formDto: IHousingFormData = this.form.value;
      formDto.apartments = this.apartmentList;
      formDto.apartments.forEach(
        (apartment, idx) =>
          (formDto.apartments[idx].supervisorsIds = formDto.apartments[idx].supervisorsIds?.map(
            (supervisor: IEnum | string) => (supervisor as IEnum)?.id
          ) as string[])
      );

      if (!this.isUpdated) {
        //Add
        this._housingService
          .createHousing(formDto)
          .pipe(
            untilDestroyed(this),
            finalize(() => (this.loading = false))
          )
          .subscribe(res => {
            this._router.navigate([`${AppRoutes.layout}/${AppRoutes.housing}/table`]);
          });
      } else {
        //Update

        formDto.id = this.housingId;
        formDto.code = 0;
        this._housingService
          .updateHousing(formDto)
          .pipe(
            untilDestroyed(this),
            finalize(() => (this.loading = false))
          )
          .subscribe(res => {
            this._router.navigate([`${AppRoutes.layout}/${AppRoutes.housing}/table`]);
          });
      }
    }
  }

  submitApartment() {
    if (this.apartmentForm.valid) {
      const apartmentData = this.apartmentForm.value as IApartment;
      if (this.isUpdatedApartment) {
        //edit row
        this.gridApi.getRowNode(apartmentData.id as string)?.setData(apartmentData);
        this.gridApi.applyTransaction({ update: [apartmentData] });
        const idx = this.apartmentList.findIndex(el => el.id == apartmentData.id);
        this.apartmentList[idx] = apartmentData;
      } else {
        //add row
        this.gridApi.applyTransaction({ add: [apartmentData] });
        this.apartmentList.push(apartmentData);
      }
      this.isUpdatedApartment = false;
      (this.apartmentForm.get('supervisorsIds') as FormArray).clear();
      this.apartmentForm.reset();
      this.apartmentForm.get('id')?.patchValue(crypto.randomUUID());
    }
  }
  //#endregion
}

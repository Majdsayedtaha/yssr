import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { IName } from 'src/app/modules/settings/models';
import { CitiesGridComponent } from './ag-grid/cities.grid.component';
import { CityService } from 'src/app/modules/settings/services/city.service';
import { IRoleEnum } from 'src/app/core/constants';
@UntilDestroy()
@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent extends CitiesGridComponent implements OnInit {
  public gridApi!: GridApi;
  public cityForm!: FormGroup;
  public role = IRoleEnum.City;
  public update: boolean = false;
  public isLoading: boolean = false;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder, public _cityService: CityService) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.cityForm = this._fb.group({
      id: [null],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      regionId: [null, [Validators.required]],
    });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getCities();
  }

  onGridReady(params: GridReadyEvent<IName>) {
    this.gridApi = params.api;
    this.getCities();
  }

  getCities() {
    this._cityService
      .getCities({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }

  cityRow(type: 'add' | 'update') {
    if (!this.cityForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._cityService
        .addCity(this.cityForm.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: res => {
            this.isLoading = this.update = false;
            this.gridApi.applyTransaction({ add: [res.data] });
            this.cityForm.reset();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else if (type === 'update') {
      this._cityService
        .updateCity(this.cityForm.value['id'], this.cityForm.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: res => {
            this.isLoading = this.update = false;
            this.gridApi.getRowNode(this.cityForm.value['id'])?.setData(this.cityForm.value);
            this.gridApi.applyTransaction({ update: [this.cityForm.value] });
            this.cityForm.reset();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
  }
}

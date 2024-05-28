import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { IName } from 'src/app/modules/settings/models';
import { RegionsGridComponent } from './ag-grid/regions.grid.component';
import { RegionService } from 'src/app/modules/settings/services/region.service';
import { IRoleEnum } from 'src/app/core/constants';
@UntilDestroy()
@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent extends RegionsGridComponent implements OnInit {
  public gridApi!: GridApi;
  public regionForm!: FormGroup;
  public role = IRoleEnum.Region;
  public update: boolean = false;
  public isLoading: boolean = false;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder, public _regionService: RegionService) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.regionForm = this._fb.group({
      id: [null],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      countryId: [null, [Validators.required]],
    });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getRegionsTable();
  }

  onGridReady(params: GridReadyEvent<IName>) {
    this.gridApi = params.api;
    this.getRegionsTable();
  }

  getRegionsTable() {
    this._regionService
      .getRegions({ ...this.paginationOptions, ...this.filterObj })
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }

  regionRow(type: 'add' | 'update') {
    if (!this.regionForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._regionService
        .addRegion(this.regionForm.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: res => {
            this.isLoading = this.update = false;
            this.gridApi.applyTransaction({ add: [res.data] });
            this.regionForm.reset();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else if (type === 'update') {
      this._regionService
        .updateRegion(this.regionForm.value['id'], this.regionForm.value)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: res => {
            this.isLoading = this.update = false;
            this.gridApi.getRowNode(this.regionForm.value['id'])?.setData(this.regionForm.value);
            this.gridApi.applyTransaction({ update: [this.regionForm.value] });
            this.regionForm.reset();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
  }
}

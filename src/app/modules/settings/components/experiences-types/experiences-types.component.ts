import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { IName } from '../../models';
import { ExperienceActionCell } from './ag-grid/custom-cell/experiences-action.cell';
import { ExperienceTypeService } from '../../services/experience-type.service';
import { Subscription, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-experiences-types',
  templateUrl: './experiences-types.component.html',
  styleUrls: ['./experiences-types.component.scss'],
})
export class ExperiencesTypesComponent extends CoreBaseComponent implements OnInit {
  experienceForm!: FormGroup;
  gridApi!: GridApi;
  public columnDefs: ColDef[] = [];
  isLoading: boolean = false;
  experienceTypeDataList!: IName[];
  experienceTypeData!: IName;
  update: boolean = false;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _experienceTypeService: ExperienceTypeService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.experienceForm = this._fb.group({
      id: [null],
      nameEn: [null, [TextValidator.english, Validators.required]],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
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
      .subscribe((res: any) => { });
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.experience_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.experience_ar',
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
        cellRenderer: ExperienceActionCell,
        cellRendererParams: {
          formGroup: this.experienceForm,
        },
      },
    ];
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getExperienceTypes();
  }

  onGridReady(params: GridReadyEvent<IName>) {
    this.gridApi = params.api;
    this.getExperienceTypes();
  }

  getExperienceTypes() {
    this._experienceTypeService.getExperienceTypes({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.experienceTypeDataList = res.data.list;
      this.paginationOptions = res.data.pagination;
    });
  }

  experienceRow(type: 'add' | 'update') {
    if (!this.experienceForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._experienceTypeService.addExperienceType(this.experienceForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.experienceForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._experienceTypeService
        .updateExperienceType(this.experienceForm.value['id'], this.experienceForm.value)
        .subscribe({
          next: res => {
            this.isLoading = this.update = false;
            this.gridApi.getRowNode(this.experienceForm.value['id'])?.setData(res.data);
            this.gridApi.applyTransaction({ update: [res.data] });
            this.experienceForm.reset();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._experienceTypeService.getExperienceTypes({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.experienceTypeDataList = res.data.list;
        this.gridOptions?.api?.setRowData(this.experienceTypeDataList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}

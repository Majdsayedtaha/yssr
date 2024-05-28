import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { VisaActionCell } from './ag-grid/custom-cell/visa-action.cell';
import { IName } from '../../models';
import { VisaTypeService } from '../../services/visa-type.service';
import { Subscription, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRoleEnum } from 'src/app/core/constants';

@UntilDestroy()
@Component({
  selector: 'app-visas-types',
  templateUrl: './visas-types.component.html',
  styleUrls: ['./visas-types.component.scss'],
})
export class VisasTypesComponent extends CoreBaseComponent implements OnInit {
  public gridApi!: GridApi;
  public visaForm!: FormGroup;
  public visaTypeData!: IName;
  public update: boolean = false;
  public role = IRoleEnum.VisaType;
  public columnDefs: ColDef[] = [];
  public visaTypeDataList!: IName[];
  public isLoading: boolean = false;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _visaTypeService: VisaTypeService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.visaForm = this._fb.group({
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
        headerName: 'setting.fields.visa_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.visa_ar',
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
        cellRenderer: VisaActionCell,
        cellRendererParams: {
          formGroup: this.visaForm,
        },
      },
    ];
  }
  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getVisaTypes();
  }

  onGridReady(params: GridReadyEvent<IName>) {
    this.gridApi = params.api;
    this.getVisaTypes();
  }

  getVisaTypes() {
    this._visaTypeService.getVisaTypes({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.visaTypeDataList = res.data.list;
      this.paginationOptions = res.data.pagination;
    });
  }

  visaTypeRow(type: 'add' | 'update') {
    if (!this.visaForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._visaTypeService.addVisaType(this.visaForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.visaForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._visaTypeService.updateVisaType(this.visaForm.value['id'], this.visaForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.getRowNode(this.visaForm.value['id'])?.setData(res.data);
          this.gridApi.applyTransaction({ update: [res.data] });
          this.visaForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._visaTypeService.getVisaTypes({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.visaTypeDataList = res.data.list;
        this.gridOptions?.api?.setRowData(this.visaTypeDataList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}

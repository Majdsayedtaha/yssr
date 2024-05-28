import { IName } from '../../models';
import { CareerService } from '../../services/career.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { CareerActionCell } from './ag-grid/custom-cells/career-action.cell';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IRoleEnum } from 'src/app/core/constants';

@UntilDestroy()
@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss'],
})
export class CareersComponent extends CoreBaseComponent implements OnInit {
  public role = IRoleEnum.Job;
  public gridApi!: GridApi;
  public careerForm!: FormGroup;
  public update: boolean = false;
  public careerDataList!: IName[];
  public columnDefs: ColDef[] = [];
  public isLoading: boolean = false;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder, public _careerService: CareerService) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.careerForm = this._fb.group({
      id: [null],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
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
        headerName: 'setting.fields.career_name_ar',
        field: 'nameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.career_name_en',
        field: 'nameEn',
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
        cellRenderer: CareerActionCell,
        cellRendererParams: {
          formGroup: this.careerForm,
        },
      },
    ];
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getCareers();
  }

  onGridReady(params: GridReadyEvent<IName>) {
    this.gridApi = params.api;
    this.getCareers();
  }

  getCareers() {
    this._careerService.getCareers({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.careerDataList = res.data.list;
      this.paginationOptions = res.data.pagination;
      this.processingCSV(this.careerDataList);
    });
  }

  careerRow(type: 'add' | 'update') {
    if (!this.careerForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      const career = { nameAr: this.careerForm.value['nameAr'], nameEn: this.careerForm.value['nameEn'] };
      this._careerService.addCareer(career).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.careerForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._careerService.updateCareer(this.careerForm.value['id'], this.careerForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.getRowNode(this.careerForm.value['id'])?.setData(res.data);
          this.gridApi.applyTransaction({ update: [res.data] });
          this.careerForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._careerService.getCareers({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.careerDataList = res.data.list;
        this.gridOptions?.api?.setRowData(this.careerDataList);
        this.processingCSV(this.careerDataList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }

  fetchingForExport() {
    const pagination = { pageNumber: 0, pageSize: this.paginationOptions.totalCount };
    return this._careerService.getCareers({ ...this.filterObj, ...pagination }).pipe(
      untilDestroyed(this),
      tap(res => (this.csvData = this.processingCSV(res.data.list))),
      map(() => this.csvData) // Return the processed data
    );
  }

  processingCSV(tableData: IName[]) {
    const headerNames: string[] = this.columnDefs.map(column => column.headerName) as string[];
    headerNames.pop(); //remove last column
    this.headersCSV = this.getTranslations(headerNames);
    return tableData.map((record: IName) => <IName>{ nameAr: record.nameAr || '', nameEn: record.nameEn || '' });
  }
}

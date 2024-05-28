import { IRoleEnum } from 'src/app/core/constants';
import { IRecruitmentProcedure } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { RecruitmentProceduresService } from '../../services/recruitment-procedures.service';
import { RecruitmentProceduresActionCell } from './ag-grid/custom-cell/recruitment-procedures-action.cell';

@UntilDestroy()
@Component({
  selector: 'app-recruitment-procedures',
  templateUrl: './recruitment-procedures.component.html',
  styleUrls: ['./recruitment-procedures.component.scss'],
})
export class RecruitmentProceduresComponent extends CoreBaseComponent implements OnInit {
  public gridApi!: GridApi;
  public update: boolean = false;
  public columnDefs: ColDef[] = [];
  public isLoading: boolean = false;
  public role = IRoleEnum.Procedure;
  public recruitmentProceduresForm!: FormGroup;
  public recruitmentProcedureList!: IRecruitmentProcedure[];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _recruitmentProceduresService: RecruitmentProceduresService
  ) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.recruitmentProceduresForm = this._fb.group({
      id: [null],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      smsTemplate: [null, Validators.required],
      emailTemplate: [null, Validators.required],
      sendSmsAfterSave: [null, Validators.required],
      sendEmailToCustomerAfterSave: [null, Validators.required],
    });

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

    this.initColDef();
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.procedure_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.procedure_ar',
        field: 'nameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.message_template',
        field: 'smsTemplate.name',
        flex: 1,
      },
      {
        headerName: 'setting.fields.email_template',
        field: 'emailTemplate.name',
        flex: 1,
      },
      {
        headerName: 'setting.fields.send_message_after_save',
        field: 'sendSmsAfterSave',
        cellRenderer: (params: ICellRendererParams) => {
          if (params.value) return `<div>${this.translateService.instant('yes')}</div>`;
          else return `<div>${this.translateService.instant('no')}</div>`;
        },
      },
      {
        headerName: 'setting.fields.send_email_after_save',
        field: 'sendEmailToCustomerAfterSave',
        cellRenderer: (params: ICellRendererParams) => {
          if (params.value) return `<div>${this.translateService.instant('yes')}</div>`;
          else return `<div>${this.translateService.instant('no')}</div>`;
        },
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: RecruitmentProceduresActionCell,
        cellRendererParams: {
          formGroup: this.recruitmentProceduresForm,
        },
      },
    ];
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getRecruitmentProcedures();
  }

  onGridReady(params: GridReadyEvent<IRecruitmentProcedure>) {
    this.gridApi = params.api;
    this.getRecruitmentProcedures();
  }

  getRecruitmentProcedures() {
    this._recruitmentProceduresService.getRecruitmentProcedures({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.recruitmentProcedureList = res.data.list;
      this.paginationOptions = res.data.pagination;
    });
  }

  recruitmentProceduresRow(type: 'add' | 'update') {
    if (!this.recruitmentProceduresForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._recruitmentProceduresService.addRecruitmentProcedures(this.recruitmentProceduresForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.recruitmentProceduresForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._recruitmentProceduresService
        .updateRecruitmentProcedures(this.recruitmentProceduresForm.value['id'], this.recruitmentProceduresForm.value)
        .subscribe({
          next: res => {
            this.isLoading = this.update = false;
            this.gridApi.getRowNode(this.recruitmentProceduresForm.value['id'])?.setData(res.data);
            this.gridApi.applyTransaction({ update: [res.data] });
            this.recruitmentProceduresForm.reset();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._recruitmentProceduresService
      .getRecruitmentProcedures({ ...this.paginationOptions, ...this.filterObj })
      .pipe(
        tap(res => {
          this.paginationOptions = res.data.pagination;
          this.recruitmentProcedureList = res.data.list;
          this.gridOptions?.api?.setRowData(this.recruitmentProcedureList);
        }),
        catchError(res => {
          return of([]);
        })
      );
  }
}

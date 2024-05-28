import { ITemplate } from '../../models';
import { IEnum } from 'src/app/core/interfaces';
import { TemplatesService } from '../../services/template.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { SMSTemplateActionCellComponent } from './ag-grid/custom-cell/sms-template-action.cell.component';
import { DialogSMSTemplateFormComponent } from './toaster/dialog-sms-template-form/dialog-sms-template-form.component';
import { IRoleEnum } from 'src/app/core/constants';
import { DialogService } from 'src/app/core/services/dialog.service';

@UntilDestroy()
@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.scss'],
})
export class SMSTemplateComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  public gridApi!: GridApi;
  public listData!: IEnum[];
  public role = IRoleEnum.Template;
  public columnDefs: ColDef[] = [];
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  // #endregion

  constructor(
    private _matDialog: DialogService,
    @Inject(INJECTOR) injector: Injector,
    private _templateService: TemplatesService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  // #region Life Cycle
  ngOnInit(): void {
    this.initColDef();
    this.watchSearch();
  }
  // #endregion

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.title_ar',
        field: 'titleAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.title_en',
        field: 'titleEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.department_type',
        field: 'category.name',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      // {
      //   headerName: 'setting.fields.text_ar',
      //   field: 'textAr',
      //   flex: 1,
      //   filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      //   tooltipField: 'textAr'
      // },
      // {
      //   headerName: 'setting.fields.text_en',
      //   field: 'textEn',
      //   flex: 1,
      //   filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      //   tooltipField: 'textEn'
      // },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: SMSTemplateActionCellComponent,
      },
    ];
  }

  watchSearch() {
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

  openEmailForm() {
    this._matDialog.openDialog(DialogSMSTemplateFormComponent, { disableClose: true }).subscribe(res => {
      if (res.template) {
        const template: ITemplate = res.template;
        this.gridApi.applyTransaction({ add: [template] });
      }
    });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getTemplateSMS();
  }

  onGridReady(params: GridReadyEvent<ITemplate>) {
    this.gridApi = params.api;
    this.getTemplateSMS();
  }

  getTemplateSMS() {
    this._templateService.getSMSTemplates({ ...this.paginationOptions, ...this.filterObj }).subscribe((res: any) => {
      this.listData = res.data.list;
      this.paginationOptions = res.data.pagination;
    });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._templateService.getSMSTemplates({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap((res: any) => {
        this.paginationOptions = res.data.pagination;
        this.listData = res.data.list;
        this.gridOptions?.api?.setRowData(this.listData);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}

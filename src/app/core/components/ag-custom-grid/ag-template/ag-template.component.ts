import { Component, OnDestroy, inject, Injector } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ColDef, GetRowIdParams, GridOptions } from 'ag-grid-community';
import { Subscription, Subject } from 'rxjs';
import { FieldTypes } from '../enums/field-types.enum';
import { HeaderRenderer } from '../header-renderers/column-header.renderer';
@Component({
  selector: 'app-ag-template',
  template: ``,
  styles: [``],
})
export class AgTemplateComponent implements OnDestroy {
  private languageSub!: Subscription;
  protected filterTypes = FieldTypes;
  public gridOptions!: GridOptions;
  public defaultOption!: ColDef;
  public filterObj: any = {};
  public csvData: any[] = [];
  public headersCSV: string[] = [];
  public translateService = inject(TranslateService);
  public subject = new Subject();

  constructor(public injector: Injector) {
    this.setConfiguration();
    this.tableLangConfig();
  }

  protected tableLangConfig() {
    this.languageSub = this.translateService.onLangChange.subscribe(({ lang }: LangChangeEvent) => {
      this.handleColumnPinning(lang === 'ar' ? 'left' : 'right');
    });
  }

  handleColumnPinning(dir?: 'left' | 'right') {
    if (!this.gridOptions?.columnDefs) return;

    const updatedColumns = this.gridOptions.columnDefs.map((col: ColDef) => {
      if (!col.pinned) return col;
      return {
        ...col,
        pinned: dir,
      };
    });

    this.gridOptions.api?.setColumnDefs(updatedColumns);
    this.gridOptions.api?.refreshHeader();
  }

  protected setConfiguration() {
    this.defaultOption = {
      resizable: true,
      wrapText: false,
      suppressMovable: true,
      unSortIcon: true,
      wrapHeaderText: false,
      autoHeaderHeight: true,
      minWidth: 150,
      flex: 1,
      sortable: true,
      filter: true,
    };

    this.gridOptions = {
      suppressCellFocus: true,
      animateRows: true,
      tooltipShowDelay: 1000,
      tooltipMouseTrack: true,
      rowStyle: {
        'margin-top': '3px',
        // 'margin-bottom': '6px',
        // position: 'relative',
        // transform: 'none',
        border: '1px solid var(--border-color)',
        'border-radius': '2px',
        color: 'var(--text-color)',
      },
      defaultColDef: {
        ...this.defaultOption,
        headerComponent: HeaderRenderer,
        headerValueGetter: this.localizeHeader.bind(this),
      },
      getRowId: (params: GetRowIdParams) => {
        return params.data.id;
      },
    };
  }

  protected localizeHeader(parameters: any): string {
    let headerIdentifier = parameters?.colDef?.headerName;
    if (headerIdentifier) return this.translateService.instant(headerIdentifier || '');
    return '';
  }

  ngOnDestroy(): void {
    this.languageSub?.unsubscribe();
  }
}

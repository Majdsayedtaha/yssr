import { Component, Input, OnChanges, SimpleChanges, INJECTOR, Inject, Injector } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams, RowNode } from 'ag-grid-community';
import { ICustomer } from '../../../models/customer.interface';
import { BusinessCaseActionCell } from './ag-grid/custom-cells/business-case-action.cell';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TimezoneToDatePipe } from 'src/app/core/pipes/timezone-normal.pipe';
import { DateShowRenderer } from 'src/app/core/components/ag-custom-grid/cell-renderers/filter-date-show.renderer';
import { IEnum } from 'src/app/core/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-business-case',
  templateUrl: './business-case.component.html',
  styleUrls: ['./business-case.component.scss'],
  providers: [TimezoneToDatePipe],
})
export class BusinessCaseComponent extends CoreBaseComponent implements OnChanges {
  @Input() businessCaseGroup!: FormGroup;
  @Input() business!: any[];
  private gridApi!: GridApi;
  public columnDefs: ColDef[] = [];
  public businessPositions!: IEnum[];
  public update = false;
  public allFilled = false;
  protected override enableFilterAndSortOfTable = false;

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };

    this.businessCaseGroup?.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      let filledFields = 0;
      this.allFilled = false;
      ['nameAr', 'nameEn', 'businessPositionId', 'phone', 'email'].forEach(formControl => {
        if (this.businessCaseGroup?.get(formControl)?.value) {
          filledFields++;
        }
      });
      if (filledFields === 5) this.allFilled = true;
    });
  }

  onGridReady(params: GridReadyEvent<ICustomer>) {
    this.gridApi = params.api;
  }

  addBusinessCaseRow() {
    if (!this.businessCaseGroup.valid || !this.allFilled) return;
    let rowId: string | undefined = '';
    this.gridApi.forEachNode(node => {
      if (node.data.id === this.businessCaseGroup.value['id']) {
        rowId = node.id;
      }
    });
    const row = this.gridApi.getRowNode(rowId) as RowNode<any>;
    if (row) {
      const index = this.business.findIndex((r: { id: string | undefined }) => rowId === r.id);
      this.business[index] = this.businessCaseGroup.value;
      this.gridApi.getRowNode(this.businessCaseGroup.value['id'])?.setData(this.businessCaseGroup.value);
      this.gridApi.applyTransaction({ update: [this.businessCaseGroup.value] });
      this.update = false;
    } else {
      this.update = false;
      (this.businessCaseGroup.parent?.get('businessArr') as FormArray).push(
        this._fb.group(this.businessCaseGroup.value)
      );
      this.gridApi.applyTransaction({ add: [this.businessCaseGroup.value] });
    }
    this.businessCaseGroup.reset({
      id: [crypto.randomUUID()],
      creationDate: [this.getToday()],
    });
  }

  getToday(): string {
    const now = new Date();
    return now.toISOString();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['businessCaseGroup']?.firstChange) {
      this.getBusinessPositions().subscribe(res => {
        this.businessPositions = res.data;
        this.columnDefs = [
          {
            headerName: 'setting.fields.employee_ar',
            field: 'nameAr',
          },
          {
            headerName: 'setting.fields.employee_en',
            field: 'nameEn',
          },
          {
            headerName: 'creation_date',
            field: 'creationDate',
            cellRenderer: DateShowRenderer,
          },
          {
            headerName: 'business_position',
            field: 'businessPosition.name',
            cellRenderer: (params: ICellRendererParams) => {
              return `<div>${
                this.businessPositions.find(b => {
                  return b.id === params.data.businessPositionId;
                })?.name || params.data.businessPosition.name
              }</div>`;
            },
          },
          {
            headerName: 'phone',
            field: 'phone',
          },
          {
            headerName: 'email',
            field: 'email',
          },
          {
            headerName: '',
            field: 'actions',
            flex: 1,
            maxWidth: 60,
            pinned: 'left',
            filter: false,
            sortable: false,
            resizable: false,
            cellRenderer: BusinessCaseActionCell,
            cellRendererParams: {
              formGroup: this.businessCaseGroup,
            },
          },
        ];
      });
    }
  }
}

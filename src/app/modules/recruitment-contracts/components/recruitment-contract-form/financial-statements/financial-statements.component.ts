import { Component, INJECTOR, Inject, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent, RowNode, GetRowIdParams, ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IContractFormData } from '../../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaxHandlerService } from 'src/app/core/services/tax-handler.service';
import { IEnum } from 'src/app/core/interfaces';
import { map } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
@UntilDestroy()
@Component({
  selector: 'app-financial-statements',
  templateUrl: './financial-statements.component.html',
  styleUrls: ['./financial-statements.component.scss'],
})
export class FinancialStatementsComponent extends CoreBaseComponent implements OnInit, OnChanges {
  @Input() financialData!: FormGroup;
  @Input() employees!: any[];
  @Input() musanedValuePercentage!: number;
  gridApi!: GridApi;
  companyTaxValue!: number;
  taxTypes!: IEnum[];
  public columnDefs: ColDef[] = [];
  update: boolean = false;
  showHaveCommissionWarning: boolean = false;
  showDeserveCommissionWarning: boolean = false;
  employeesArr!: any;
  employeeCommissionType!: 1 | 2;
  selected!: any;
  protected override enableFilterAndSortOfTable = false;
  get employeesArray(): FormArray {
    return this.financialData.get('employees') as FormArray;
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _snackBar: NotifierService,
    private _taxHandlerService: TaxHandlerService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      getRowId: (params: GetRowIdParams) => {
        return params.data.employeeId.id;
      },
      context: { parentComp: this },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['musanedValuePercentage']?.currentValue > 0) {
      this.financialData
        .get('musanedRequestAmount')
        ?.patchValue(
          (
            this.financialData.get('contractAmount')?.value *
            (changes['musanedValuePercentage'].currentValue / 100)
          ).toFixed(2)
        );
    }
  }

  ngOnInit(): void {
    this.initColDef();
    this.fetchData();
    this.calcRecruitmentValues();
    this.watchEmployeeData();
    this.watchMusanedTypeData();
    this.watchRecruitmentValue();
  }

  watchRecruitmentValue() {
    this.financialData
      .get('contractAmount')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (value > 0 && this.musanedValuePercentage > 0) {
          this.financialData
            .get('musanedRequestAmount')
            ?.patchValue((value * (this.musanedValuePercentage / 100)).toFixed(2));
        }
      });
  }

  watchMusanedTypeData() {
    this.financialData
      .get('musanedRequestTypeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data && this.musanedValuePercentage > 0) {
          this.financialData
            .get('musanedRequestAmount')
            ?.patchValue(
              (this.financialData.get('contractAmount')?.value * (this.musanedValuePercentage / 100)).toFixed(2)
            );
        }
      });
  }

  watchEmployeeData() {
    this.financialData
      .get('employee')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(data => {
        if (data) {
          this.selected = this.employeesArr.find((e: any) => {
            return e.id === data.id;
          });
          this.showHaveCommissionWarning = !this.selected.withCommission;
          this.showDeserveCommissionWarning = !this.selected.commissionSections[0]?.deserveCommission;
          if (this.showHaveCommissionWarning || this.showDeserveCommissionWarning) {
            this.financialData.get('amount')?.patchValue(0);
            return;
          }
          this.employeeCommissionType = this.selected.commissionSections[0]?.type;
          if (this.selected.commissionSections[0]?.value >= 0) {
            this.financialData.get('amount')?.patchValue(this.selected.commissionSections[0]?.value || 0);
          }
        }
      });
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'employee_name',
        field: 'employeeName',
        cellRenderer: (params: ICellRendererParams) => {
          return `<div>${params.value || params.data.employeeId.name}</div>`;
        },
        flex: 1,
      },
      {
        headerName: 'commission_amount',
        field: 'amount',
        flex: 1,
      },
      // {
      //   headerName: '',
      //   field: 'actions',
      //   maxWidth: 90,
      //   pinned: 'left',
      //   filter: false,
      //   sortable: false,
      //   resizable: false,
      //   cellRenderer: CommissionActionCell,
      //   cellRendererParams: {
      //     formGroup: this.financialData,
      //   },
      // },
    ];
  }

  onGridReady(params: GridReadyEvent<IContractFormData>) {
    this.gridApi = params.api;
  }

  fetchData() {
    this.getCompanyTaxValue();
    this.fetchTaxTypesValues();
  }

  fetchTaxTypesValues() {
    this.fetchTaxTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.taxTypes = res.data));
  }

  getCompanyTaxValue() {
    this.getCompanyTax()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.companyTaxValue = res.data;
        this.financialData.get('taxAmount')?.patchValue(this.companyTaxValue ?? 0);
      });
  }

  calcRecruitmentValues() {
    this.financialData.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      const contractAmount = +(value['contractAmount'] ?? 0);
      const discount = +(value['discount'] ?? 0);
      const transportationAmount = +(value['transportationAmount'] ?? 0);
      if (
        contractAmount >= 0 &&
        discount >= 0 &&
        discount < 100 &&
        this.companyTaxValue >= 0 &&
        this.companyTaxValue < 100
      ) {
        const taxType = this.taxTypes?.find(type => this.financialData.get('taxTypeId')?.value === type.id)?.value || 1;
        const taxAmount = this._taxHandlerService.calcTaxAmount(
          taxType,
          contractAmount,
          discount,
          +this.companyTaxValue
        );
        let withoutTaxAmount = 0;
        if (taxType == 1) {
          withoutTaxAmount = contractAmount - taxAmount;
        } else {
          withoutTaxAmount = contractAmount;
        }

        if (typeof taxAmount === 'number' && typeof withoutTaxAmount === 'number')
          this.financialData.patchValue(
            {
              taxAmount: taxAmount.toFixed(2),
              withoutTaxAmount: withoutTaxAmount.toFixed(2),
            },
            { emitEvent: false }
          );

        if (typeof transportationAmount === 'number') {
          let totalWithTax = 0;
          let totalWithoutTax = 0;
          if (taxType == 1) {
            totalWithTax = contractAmount - (discount / 100) * contractAmount + transportationAmount;
            totalWithoutTax = totalWithTax - taxAmount;
          } else {
            totalWithTax = contractAmount + taxAmount - (discount / 100) * contractAmount + transportationAmount;
            totalWithoutTax = totalWithTax - taxAmount;
          }

          if (typeof totalWithoutTax === 'number' && typeof totalWithTax === 'number')
            this.financialData.patchValue(
              {
                totalRecruitmentAmountWithTax: +totalWithTax.toFixed(2),
                totalRecruitmentAmountWithoutTax: +totalWithoutTax.toFixed(2),
              },
              { emitEvent: false }
            );
        } else {
          this.financialData.patchValue(
            {
              totalRecruitmentAmountWithTax: 0,
              totalRecruitmentAmountWithoutTax: 0,
            },
            { emitEvent: false }
          );
        }
      } else {
        this.financialData.patchValue(
          {
            taxAmount: 0,
            withoutTaxAmount: 0,
          },
          { emitEvent: false }
        );
      }
    });
  }

  actionCommission() {
    const employee = this.financialData.get('employee');
    const amount = this.financialData.get('amount');
    if (!employee?.value && !amount?.value) return;
    this.showDeserveCommissionWarning = this.showHaveCommissionWarning = false;
    let rowId: string | undefined = '';
    this.gridApi.forEachNode(node => {
      if (node.data.employeeId.id === employee?.value?.id) {
        rowId = node.id;
      }
    });
    const row = this.gridApi.getRowNode(rowId) as RowNode<any>;
    if (row && this.update) {
      const index = this.employeesArray.value.findIndex((r: { employeeId: string | undefined }) => {
        rowId === r.employeeId;
      });
      this.employeesArray.value[index] = {
        employeeId: employee?.value,
        amount: amount?.value,
      };
      this.gridApi.getRowNode(index)?.setData(this.employeesArray.value[index]);
      this.gridApi.applyTransaction({ update: [this.employeesArray.value[index]] });
      this.gridApi.refreshCells({ force: true });
      this.update = false;
    } else {
      if (row) {
        this._snackBar.showNormalSnack(this.translateService.instant('toast.employee_already_added'));
        return;
      }
      (this.financialData.get('employees') as FormArray).push(
        this._fb.group({
          employeeId: JSON.parse(JSON.stringify(employee?.value.id)),
          amount: JSON.parse(JSON.stringify(amount?.value)),
        })
      );
      this.gridApi.applyTransaction({
        add: [
          {
            employeeId: employee?.value,
            amount: amount?.value,
          },
        ],
      });
    }
    this.financialData.patchValue({
      employee: null,
      amount: null,
    });
  }

  getEmployeesSelect = () => {
    return this.fetchEmployeesSelect(
      null,
      this.financialData.parent?.get('contractData')?.get('countryId')?.value
    ).pipe(
      untilDestroyed(this),
      map((res: any) => {
        this.employeesArr = res.data;
        return res;
      })
    );
  };

  fetchMusanedRequestTypesSelect = () => {
    return this.fetchMusanedRequestTypes().pipe(
      untilDestroyed(this),
      map((res: any) => {
        this.musanedValuePercentage = res.data[0].value;
        return res;
      })
    );
  };
}

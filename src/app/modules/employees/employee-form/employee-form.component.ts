import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeesService } from 'src/app/modules/employees/services/employee.service';
import { EnumService } from 'src/app/core/services/enums.service';
import { IEnum } from 'src/app/core/interfaces';
import { IRoleEnum } from 'src/app/core/constants';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { CommissionActionCell } from '../employees-table/ag-grid/commission-action.cell';
import { ActivatedRoute, Router } from '@angular/router';
import { ICommissionSection, ISettingEmployee } from 'src/app/modules/employees/interfaces/employee.interfaces';
import { NotifierService } from 'src/app/core/services/notifier.service';
@UntilDestroy()
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent extends CoreBaseComponent implements OnInit {
  public employeeId!: string;
  public updateRow: boolean = false;
  public employeeForm!: FormGroup;
  public isLoading: boolean = false;
  public loadingData: boolean = false;
  public role = IRoleEnum.Employee;
  public commissionType: number = 1;
  public commissionTypes!: IEnum[];
  public columnDefs: ColDef[] = [];
  public commissionSectionsArray!: ICommissionSection[];
  private gridApi!: GridApi;
  get f() {
    return this.employeeForm?.controls;
  }
  get commissionRowFormGroup(): FormGroup {
    return this.getFomGroup('commissionSectionRow') as FormGroup;
  }
  get commissionSections(): FormGroup {
    return this.getFomGroup('commissionSections') as FormGroup;
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _employeesService: EmployeesService,
    private _enumService: EnumService,
    private _router: Router,
    private _snackBar: NotifierService,
    activatedRoute: ActivatedRoute
  ) {
    super(injector);
    this.employeeId = activatedRoute.snapshot.params['id'];
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    if (this.employeeId) this.getEmployeeData();
    this.employeeForm = this._fb.group({
      id: [null],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      phone1: [null, Validators.required],
      phone2: [null],
      email1: [null, Validators.required],
      email2: [null],
      employeeTypeId: [null, Validators.required],
      withCommission: [false],
      commissionSectionRow: this._fb.group({
        id: [crypto.randomUUID()],
        commissionTypeId: [null],
        commissionAmount: [0, [Validators.min(0)]],
        countryId: [null],
        sectionId: [null],
        contractsCount: [0, [Validators.min(0)]],
      }),
    });

    this._enumService
      .getCommissionTypes()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.commissionTypes = res.data;
      });
    this.commissionTypeValue();
    this.watchControls();
    this.initColDef();
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.commission_type',
        field: 'commissionTypeId.name',
      },
      {
        headerName: 'setting.fields.value_percentage_commission',
        field: 'commissionAmount',
        cellRenderer: (params: ICellRendererParams) => {
          return params.data.commissionTypeId.value === 1
            ? `<div>${params.value + ' ' + this.translateService.instant('SAR')}</div>`
            : `<div>${params.value + ' %'}</div>`;
        },
      },
      {
        headerName: 'setting.fields.country',
        field: 'countryId.name',
      },
      {
        headerName: 'setting.fields.section',
        field: 'sectionId.name',
      },
      {
        headerName: 'setting.fields.contracts_count',
        field: 'contractsCount',
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: CommissionActionCell,
        cellRendererParams: {
          formGroup: this.employeeForm,
        },
      },
    ];
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }

  watchControls() {
    this.f['withCommission'].valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      if (value) {
        this.employeeForm.addControl('commissionSections', new FormControl([], Validators.required));
        this.commissionRowFormGroup.get('commissionAmount')?.addValidators([Validators.min(0)]);
        this.commissionRowFormGroup.get('contractsCount')?.addValidators([Validators.min(0)]);
        this.updateValueAndValidity(['commissionAmount', 'contractsCount']);
      } else {
        this.employeeForm.removeControl('commissionSections');
        this.commissionRowFormGroup.get('commissionAmount')?.removeValidators([Validators.min(0)]);
        this.commissionRowFormGroup.get('contractsCount')?.removeValidators([Validators.min(0)]);
        this.updateValueAndValidity(['commissionAmount', 'contractsCount']);
      }
    });
  }

  updateValueAndValidity(names: string[]) {
    names.forEach(name => {
      this.commissionRowFormGroup.get(name)?.updateValueAndValidity();
    });
  }

  commissionTypeValue() {
    this.commissionRowFormGroup
      .get('commissionTypeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (value) {
          this.commissionRowFormGroup.get('commissionAmount')?.markAsTouched();
          this.commissionType = this.commissionTypes.find(data => data.id === value.id)?.value || 1;
          if (this.commissionType === 1) {
            this.commissionRowFormGroup.get('commissionAmount')?.setValidators([Validators.min(0)]);
            this.commissionRowFormGroup.get('commissionAmount')?.updateValueAndValidity();
          } else {
            this.commissionRowFormGroup.get('commissionAmount')?.addValidators(Validators.max(100));
            this.commissionRowFormGroup.get('commissionAmount')?.updateValueAndValidity();
          }
        }
      });
  }

  saveEmployeeData(type: 'update' | 'add') {
    if (!this.employeeForm.valid) return;
    this.isLoading = true;
    const commissionSectionsValue: any[] = this.getFomGroup('commissionSections')?.value;
    const commissionSectionsToSave = commissionSectionsValue?.map(cs => {
      return {
        ...cs,
        commissionTypeId: cs.commissionTypeId.id,
        sectionId: cs.sectionId.id,
        countryId: cs.countryId.id,
      };
    });
    const employee = {
      ...this.employeeForm.value,
      employeeTypeId: this.employeeForm.value['employeeTypeId'].id,
      commissionSections: commissionSectionsToSave,
    };
    delete employee['commissionSectionRow'];
    if (type === 'add') {
      this._employeesService.addEmployee(employee).subscribe({
        next: res => {
          this.employeeForm.reset();
          // this._router.navigateByUrl('employees/employees-table');
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._employeesService.updateEmployee(this.employeeId, employee).subscribe({
        next: res => {
          this._router.navigateByUrl('employees/employees-table');
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  pushToCommissionArray(type: 'add' | 'update') {
    const index = this.commissionSections?.value.findIndex((s: any) => {
      const sectionDuplicatedCond =
        s.sectionId.id === this.commissionRowFormGroup.value.sectionId.id &&
        s.countryId.id === this.commissionRowFormGroup.value.countryId.id;
      return (
        (sectionDuplicatedCond && type === 'add') ||
        (sectionDuplicatedCond && type === 'update' && s.id !== this.commissionRowFormGroup.value.id)
      );
    });
    if (index >= 0) {
      this._snackBar.showNormalSnack(this.translateService.instant('can_not_repeat_commission'));
      return;
    }
    if (type === 'add') {
      const newCommissionValue = { ...this.commissionRowFormGroup.value, id: crypto.randomUUID() };
      this.employeeForm.get('commissionSections')?.setValue([...this.commissionSections?.value, newCommissionValue]);
      this.gridApi.applyTransaction({ add: [{ ...newCommissionValue }] });
      this.commissionRowFormGroup.reset({
        id: crypto.randomUUID,
        commissionAmount: 0,
        contractsCount: 0,
      });
    } else if (type === 'update') {
      const updatedCommissionValue = this.commissionRowFormGroup.value;
      const rowIndex = this.commissionSections?.value.findIndex((e: any) => {
        return e.id === updatedCommissionValue.id;
      });
      const commissionSectionsValue = this.commissionSections?.value.slice();
      commissionSectionsValue[rowIndex] = updatedCommissionValue;
      this.commissionSections?.setValue(commissionSectionsValue);
      this.gridApi.applyTransaction({ update: [{ ...updatedCommissionValue }] });
      this.commissionRowFormGroup.reset({
        id: crypto.randomUUID,
        commissionAmount: 0,
        contractsCount: 0,
      });
    }
    this.updateRow = false;
  }

  getFomGroup(control: string): FormGroup {
    return this.employeeForm.get(control) as FormGroup;
  }

  areAllControlsFilled(formGroup: FormGroup): boolean {
    let allFilled = true;

    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);

      if (control && (control.value === '' || control.value === null)) {
        allFilled = false;
      }
    });

    if (allFilled && this.commissionRowFormGroup.valid) return true;
    else return false;
  }

  getEmployeeData() {
    this.loadingData = true;
    this._employeesService.getEmployeeData(this.employeeId).subscribe(({ data }) => {
      this.loadingData = false;
      const employeeData: ISettingEmployee = data;
      const commissionSections = employeeData.commissionSections.map(c => {
        return {
          ...c,
          commissionTypeId: c.commissionType,
          sectionId: c.section,
          countryId: c.country,
        };
      });
      this.employeeForm.patchValue({
        ...employeeData,
        employeeTypeId: employeeData['employeeType'],
      });
      this.commissionSections?.patchValue(commissionSections);
      this.commissionSectionsArray = commissionSections as any;
    });
  }
}

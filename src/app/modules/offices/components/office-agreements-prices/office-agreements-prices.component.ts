import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { AgreementPriceService } from '../../services/agreement-price.service';
import { IAgreementPriceForm, IAgreementPriceRow } from '../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { IRoleEnum } from 'src/app/core/constants';
import { AgreementPriceActionCell } from './agGrid/custom-cell/agreement-price-action.cell';
import { DialogAgreementPriceComponent } from './dialog-agreement-price/dialog-agreement-price.component';
import { IEnum } from 'src/app/core/interfaces';
import { DialogService } from 'src/app/core/services/dialog.service';

@UntilDestroy()
@Component({
  selector: 'app-office-agreements-prices',
  templateUrl: './office-agreements-prices.component.html',
  styleUrls: ['./office-agreements-prices.component.scss'],
})
export class OfficeAgreementsPricesComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  public gridApi!: GridApi;
  public update: boolean = false;
  public isLoading: boolean = false;
  public columnDefs: ColDef[] = [];
  public submitting: boolean = false;
  public rowData!: IAgreementPriceRow[];
  public role = IRoleEnum.AgreementPrice;
  public externalOfficePriceForm!: FormGroup;
  //#endregion

  public religions: IEnum[] = [];
  public experiences: IEnum[] = [];
  public jobs: IEnum[] = [];

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    public matDialog: DialogService,
    private _agreementPriceService: AgreementPriceService
  ) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.initialForm();
    this.initColDef();
  }

  //#region Form
  initialForm() {
    this.externalOfficePriceForm = this._fb.group({
      externalOfficeId: [null, Validators.required],
      jobId: [null, Validators.required],
      experienceTypeId: [null],
      religionId: [null, Validators.required],
      agreementPrice: [0, Validators.required],
      recruitmentPeriod: [0],
      id: ['id_' + crypto.randomUUID(), Validators.nullValidator],
    });

    this.watchJobControl();
    this.watchReligionControl();
    this.watchExternalOfficeControl();
    this.watchExperienceTypeControl();
  }

  watchExternalOfficeControl() {
    this.externalOfficePriceForm.controls['externalOfficeId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(externalOfficeId => {
        if (externalOfficeId) {
          // this.externalOfficePriceForm.controls['externalOfficeId'].patchValue(externalOfficeId, { emitEvent: false });
          if (this.canBeFetched()) this.fetchAgreementPrice();
          this.fetchPriceData(externalOfficeId);
        }
      });
  }

  watchJobControl() {
    this.externalOfficePriceForm.controls['jobId'].valueChanges.pipe(untilDestroyed(this)).subscribe(jobId => {
      if (jobId) {
        this.externalOfficePriceForm.controls['jobId'].patchValue(jobId, { emitEvent: false });
        if (this.canBeFetched()) this.fetchAgreementPrice();
      }
    });
  }

  watchExperienceTypeControl() {
    this.externalOfficePriceForm.controls['experienceTypeId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(experienceTypeId => {
        if (experienceTypeId) {
          this.externalOfficePriceForm.controls['experienceTypeId'].patchValue(experienceTypeId, { emitEvent: false });
          if (this.canBeFetched()) this.fetchAgreementPrice();
        }
      });
  }

  watchReligionControl() {
    this.externalOfficePriceForm.controls['religionId'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(religionId => {
        if (religionId) {
          this.externalOfficePriceForm.controls['religionId'].patchValue(religionId, { emitEvent: false });
          if (this.canBeFetched()) this.fetchAgreementPrice();
        }
      });
  }

  //#endregion

  // #region Column
  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.career',
        field: 'job.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.jobId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.experienceType',
        field: 'experienceType.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.experienceTypeId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.religion',
        field: 'religion.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.religionId?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'field.office.recruitment_period',
        field: 'recruitmentPeriod',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.price',
        field: 'agreementPrice',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: AgreementPriceActionCell,
        cellRendererParams: {
          formGroup: this.externalOfficePriceForm,
        },
      },
    ];
  }

  // #endregion
  addRecord() {
    if (!this.externalOfficePriceForm.get('externalOfficeId')?.value) return;
    this.update = false;
    this.externalOfficePriceForm.reset(
      {
        id: 'id_' + crypto.randomUUID(),
        externalOfficeId: this.externalOfficePriceForm?.get('externalOfficeId')?.value,
      },
      { emitEvent: false }
    );
    const dialogRef = this.matDialog.openDialog(DialogAgreementPriceComponent, {
      data: { priceForm: this.externalOfficePriceForm, update: this.update },
    });
    dialogRef.subscribe({
      next: res => {
        if (res && !this.update) {
          const data = { ...this.externalOfficePriceForm.value, ...res.priceForm.value };
          this.rowData.push(data);
          this.gridApi.applyTransaction({ add: [data] });
        }
      },
    });
  }

  canBeFetched = (): boolean => {
    const agreement: IAgreementPriceForm = this.externalOfficePriceForm.value;

    return (
      agreement.externalOfficeId != null &&
      agreement.experienceTypeId != null &&
      agreement.religionId != null &&
      (agreement.jobId as IEnum).id != null
    );
  };

  fetchAgreementPrice() {
    this._agreementPriceService.loadingExternalOfficePrice = true;
    const formValue = this.externalOfficePriceForm.value;
    const agreementData = {
      ...formValue,
      jobId: formValue.jobId?.id ?? formValue.jobId,
      experienceTypeId: formValue.experienceTypeId?.id ?? formValue.experienceTypeId,
      religionId: formValue.religionId?.id ?? formValue.religionId,
    };

    this._agreementPriceService
      .getAgreementPrice(agreementData)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this._agreementPriceService.loadingExternalOfficePrice = false))
      )
      .subscribe((response: IResponse<IAgreementPriceForm>) => {
        let agreement = response.data;
        if (agreement != null) {
          this.externalOfficePriceForm.patchValue({
            agreementPrice: agreement.agreementPrice ?? 0,
            recruitmentPeriod: agreement.recruitmentPeriod ?? 0,
          });
        } else {
          this.externalOfficePriceForm.patchValue({
            agreementPrice: 0,
            recruitmentPeriod: 0,
          });
        }
        this._agreementPriceService.loadingExternalOfficePrice = false;
      });
  }

  fetchPriceData(externalOfficeId: string) {
    this._agreementPriceService
      .getAgreementPrices(externalOfficeId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<any>) => {
        this.rowData = response.data;
      });
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridApi?.setRowData([]);
  }

  // #region Actions
  saveChanges() {
    this.isLoading = true;
    this.submitting = true;

    const prices = this.rowData.map(row => {
      delete row?.religion;
      delete row?.experienceType;
      delete row?.job;
      return {
        ...row,
        jobId: (row?.jobId as IEnum)?.id ? (row?.jobId as IEnum)?.id : row?.jobId,
        religionId: (row?.religionId as IEnum)?.id ? (row?.religionId as IEnum)?.id : row?.religionId,
        experienceTypeId: (row?.experienceTypeId as IEnum)?.id
          ? (row?.experienceTypeId as IEnum)?.id
          : row?.experienceTypeId,
      };
    });

    this._agreementPriceService
      .addAgreementPrice({
        externalOfficeId: this.externalOfficePriceForm.get('externalOfficeId')?.value,
        prices: prices,
      })
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.isLoading = false;
          this.submitting = false;
        })
      )
      .subscribe(() => {
        this.externalOfficePriceForm.reset();
        this.rowData = [];
      });
  }
  //#endregion

  getEnumRecord(id: string, array: IEnum[]) {
    return array.find(el => el.id == id);
  }
}

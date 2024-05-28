import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IAgreementPriceRow, IExternalOfficeForm } from '../../models';
import { ExternalOfficesService } from '../../services/external-office.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AgreementPriceService } from '../../services/agreement-price.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
@UntilDestroy()
@Component({
  selector: 'side-details-office',
  templateUrl: './side-details-office.component.html',
  styleUrls: ['./side-details-office.component.scss'],
})
export class SideDetailsOfficeComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  officeDetails!: IExternalOfficeForm | null;
  isLoading = false;
  public columnDefs: ColDef[] = [];
  public rowData!: IAgreementPriceRow[];
  gridApi!: GridApi;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public externalOfficesService: ExternalOfficesService,
    private _agreementPriceService: AgreementPriceService
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.checkIfNeedToOpen();
    this.initColDef();
  }
  // #region Column
  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.career',
        field: 'job.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.job?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.experienceType',
        field: 'experienceType.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.experienceType?.name}</div>`;
        },
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.religion',
        field: 'religion.name',
        cellRenderer: (params: any) => {
          return `<div>${params.value || params.data?.religion?.name}</div>`;
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
    ];
  }
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }
  checkIfNeedToOpen() {
    this.externalOfficesService.sideOfficeDetails.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        this.isLoading = true;
        this.sidenav.open();

        this.externalOfficesService
          .getExternalOfficeInfo(data)
          .pipe(untilDestroyed(this))
          .subscribe(res => {
            this.officeDetails = res.data as IExternalOfficeForm;
            this.isLoading = false;
          });

        this._agreementPriceService
          .getAgreementPrices(data)
          .pipe(untilDestroyed(this))
          .subscribe(res => {
            this.rowData = res.data;
          });
      }
    });
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.externalOfficesService.sideOfficeDetails.next(null);
  }
}

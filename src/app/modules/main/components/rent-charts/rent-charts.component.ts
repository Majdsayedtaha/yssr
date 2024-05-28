import { Component, ElementRef, INJECTOR, Inject, Injector, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Chart } from 'chart.js';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { HomeService } from '../../services/home.service';
import { IRent } from '../../models/home.interface';
import { IPaginationOptions } from 'src/app/core/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';
@UntilDestroy()
@Component({
  selector: 'app-rent-charts',
  templateUrl: './rent-charts.component.html',
  styleUrls: ['./rent-charts.component.scss'],
  providers: [DatePipe],
})
export class RentChartsComponent extends CoreBaseComponent {
  @ViewChild('pieChartTypeRent') pieChartTypeRent!: ElementRef;
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  ELEMENT_DATA: any[] = [
    { position: 1, name: 'Hydrogen', date: '23/4/2023' },
    { position: 2, name: 'Helium', date: '23/4/2023' },
    { position: 3, name: 'Lithium', date: '23/4/2023' },
    { position: 4, name: 'Beryllium', date: '23/4/2023' },
    { position: 5, name: 'Boron', date: '23/4/2023' },
  ];
  displayedColumns: string[] = ['position', 'name', 'date'];
  dataSource = this.ELEMENT_DATA;
  clickedRows = new Set<any>();
  rentData!: IRent;
  byTypeName: string[] = [];
  byTypeCount: number[] = [];
  public columnDefs: ColDef[] = [];
  public rowData: any[] = [];
  date: any;
  pieChartTypeRentData = {
    labels: this.byTypeName,
    datasets: [
      {
        label: this._translateService.instant('number_contracts_lease_type'),
        data: this.byTypeCount,
        backgroundColor: ['rgb(255, 99, 132, 0.5)', 'rgba(99, 161, 255, 0.5)', 'limegreen', 'lightcoral'],
        hoverOffset: 4,
      },
    ],
  };
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _translateService: TranslateService,
    private _homeService: HomeService,
    private _datePipe: DatePipe
  ) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }
  ngOnInit(): void {
    this.columnDefs = [
      {
        headerName: 'contract_code',
        field: 'requestNumber',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'label.contract.created_at',
        field: 'requestDate',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
      {
        headerName: 'customer_name',
        field: 'customerName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.worker.name',
        field: 'workerName',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.worker.nationality',
        field: 'nationality',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.worker.profession',
        field: 'job',
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'table.contract.period',
        field: 'rentDaysPeriod',
        filter: this.filterStrategy.matcher(this.filterTypes.number)?.getFilterRenderer(),
      },
      {
        headerName: 'table.contract.status',
        field: 'status',
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      },

      {
        headerName: 'table.rent.procedure.last',
        field: 'lastProcedureName',
        filter: this.filterStrategy.matcher(this.filterTypes.radio)?.getFilterRenderer(),
      },
      {
        headerName: 'table.rent.procedure.last_date',
        field: 'lastProcedureDate',
        filter: this.filterStrategy.matcher(this.filterTypes.rangeDate)?.getFilterRenderer(),
      },
    ];
  }
  getData(date?: any) {
    this._homeService.getAllRent(date).subscribe(res => {
      if (res) {
        this.rentData = res.data;
        this.rowData = this.rentData.rentRequests.list;
        this.paginationOptions = this.rentData.rentRequests.pagination;
        this.rentData.byTypeCount.data.forEach((ele: any) => {
          this.byTypeCount.push(ele.count);
          this.byTypeName.push(ele.name);
        });
        if (date == '') {
          this.createCharts();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.getData('');
    this._homeService.dashboardFilter$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res.idDepartment === '7') {
        if (res.date.from && res.date.to) {
          this.date = {
            from: this._datePipe.transform(res.date.from.toLocaleDateString(), 'MM/dd/YYYY'),
            to: this._datePipe.transform(res.date.to.toLocaleDateString(), 'MM/dd/YYYY'),
          };
          this.getData(this.date);
        } else this.getData();
      }
    });
  }
  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    if (this.date.from && this.date.to) {
      this.date = { from: this.date.from, to: this.date.to };
      this.getData(this.date);
    } else this.getData();
  }
  onGridReady(params: GridReadyEvent<any>) {}
  createCharts(): void {
    const pieChartTypeRent = this.pieChartTypeRent.nativeElement.getContext('2d');
    new Chart(pieChartTypeRent, {
      type: 'pie',
      data: this.pieChartTypeRentData,
      options: {
        plugins: {
          title: {
            display: true,
            text: this._translateService.instant('number_contracts_lease_type'),
            font: {
              family: "'Tajawal'",
              size: 12,
            },
          },
        },
      },
    });
  }
}

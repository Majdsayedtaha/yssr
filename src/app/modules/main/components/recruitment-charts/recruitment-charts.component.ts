import { Component, ElementRef, OnInit, ViewChild, INJECTOR, Inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Chart, { ChartOptions } from 'chart.js/auto';
import { HomeService } from '../../services/home.service';
import { IAllRecruitment, ILastProceduresCount, IRecruitmentTotalCount } from '../../models/home.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TrialPeriodRecruitmentGridComponent } from './ag-grid/grid-TrialPeriodRecruitment.component';
import { DatePipe } from '@angular/common';
import { WorkerService } from 'src/app/modules/worker/services/worker.service';
import { IWorker } from 'src/app/modules/worker/models';
import { FormControl } from '@angular/forms';
import { IPaginationOptions } from 'src/app/core/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-recruitment-charts',
  templateUrl: './recruitment-charts.component.html',
  styleUrls: ['./recruitment-charts.component.scss'],
  providers: [DatePipe],
})
export class RecruitmentChartsComponent extends TrialPeriodRecruitmentGridComponent implements OnInit {
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('barchartTowMonth') barchartTowMonth!: ElementRef;
  months = [{month: 'Jan', value: '0'},
  {month: 'Feb', value: '1'},
  {month: 'Mar', value: '2'},
  {month: 'Apr', value: '3'},
  {month: 'May', value: '4'},
  {month: 'Jun', value: '5'},
  {month: 'Jul', value: '6'},
  {month: 'Aug', value: '7'},
  {month: 'Sep', value: '8'},
  {month: 'Oct', value: '9'},
  {month: 'Nov', value: '10'},
  {month: 'Dec', value: '11'},
];

from = '0';
workers:IWorker[]=[];
workerName=new FormControl('');
toMonth = '11';
  chartData = {
    "dataSet1" : Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10),
    "dataSet2" : Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10)
  };
  public recruitmentTotalCount: IRecruitmentTotalCount = { total: 0 };
  public contractsCountPerYearName: string[] = [];
  public contractsCountPerYear: string[] = [];
  public countriesContractsCount: number[] = [];
  public countriesContracts: string[] = [];
  public contractsPerCurrentYear: any;
  public countriesContractsAll: any;
  public allData!: IAllRecruitment;
  public latestProcedureRecruitment: ILastProceduresCount[] = [];
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  private gridApi!: GridApi;
  public listData!: IAllRecruitment[];

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _translateService: TranslateService,
    private _homeService: HomeService,
    private _datePipe: DatePipe,
    private _workerService:WorkerService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllRecruitment('');
    this._homeService.dashboardFilter$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res.idDepartment === '1') {
        if (res.date.from && res.date.to) {
          const date = {
            from: this._datePipe.transform(res.date.from.toLocaleDateString(), 'MM/dd/YYYY'),
            to: this._datePipe.transform(res.date.to.toLocaleDateString(), 'MM/dd/YYYY'),
          };
          this.getAllRecruitment(date);
        } else this.getAllRecruitment();
      }
    });
    this.subjectSub = this.subject
    ?.pipe(
      untilDestroyed(this),
      debounceTime(500),
      switchMap(res => {
        return this.getList(res)?.pipe(catchError(() => of([])));
      }),
      catchError(() => of([]))
    )
    .subscribe(() => {});
  };


  getAllRecruitment(date?: any) {
    this._homeService
      .getAllRecruitment(date)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
   
          this.allData = res.data;
          this.recruitmentTotalCount = res.data.totalCount.data;
          this.rowDataExpirationRecruitment = res.data.aboutToEndContracts.list;
          this.paginationOptionsExpirationRecruitment = res.data.aboutToEndContracts.pagination;

          this.rowDataTrialPeriodRecruitment = res.data.aboutToEndWarrantyContracts.list;
          this.paginationOptionsTrialPeriodRecruitment = res.data.aboutToEndWarrantyContracts.pagination;

          this.latestProcedureRecruitment = res.data.lastProcedureCount.data;

          this.contractsPerCurrentYear = res.data.contractsPerCurrentYear.data;
          this.countriesContractsAll = res.data.countriesContractsCount.data;

          this.contractsPerCurrentYear.forEach((ele: any) => {
            this.contractsCountPerYear.push(ele.count.toString());
            this.contractsCountPerYearName.push(ele.name);
          });
          this.countriesContractsAll.forEach((ele: any) => {
            this.countriesContracts.push(ele.name);
            this.countriesContractsCount.push(ele.count);
          });
          if (date === '') {
            this.createRecruitmentYearChart();
            this.createRecruitmentCountriesChart();
            this.createRecruitmentCountriesChartBetweenTwoMonth();
          }
        }
      });
  }

  getList(deepSearch?: any)
  {
    // console.log(deepSearch.target.value)
    if (deepSearch) 
    {
      this.filterObj['query'] = deepSearch.target.value;
    }
    console.log(this.filterObj )
   return  this._homeService.getContractList({ ...this.paginationOptions, ...this.filterObj }).pipe(tap((res:any)=>{
      console.log(res)
      this.paginationOptions = res.data.pagination;
      this.listData = res.data.list;
      this.gridApi.setRowData(this.listData);
    }));
  
  }
  getContractList()
  {
    this._homeService.getContractList({ ...this.paginationOptions, ...this.filterObj }).subscribe((res:any)=>{
      this.paginationOptions = res.data.pagination;
      this.listData = res.data.list;
      this.gridApi.setRowData(this.listData);
    })
  }
  
  
  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getContractList();
  }
  onGridReady(params: GridReadyEvent<IAllRecruitment>) {
    this.gridApi = params.api;
    this.getContractList();
  }


  //!!Tables
  onSetPageExpirationRecruitment(pageNumber: number) {
    this.paginationOptionsExpirationRecruitment = {
      ...this.paginationOptionsExpirationRecruitment,
      pageNumber: pageNumber,
    };
  }
  onSetPageTrialPeriodRecruitment(pageNumber: number) {
    this.paginationOptionsTrialPeriodRecruitment = {
      ...this.paginationOptionsTrialPeriodRecruitment,
      pageNumber: pageNumber,
    };
  }

  //!!Charts
  barChartData = {
    labels: this.countriesContracts,
    datasets: [
      {
        label: this._translateService.instant('number_recruitment'),
        data: this.countriesContractsCount,
        backgroundColor: 'rgba(99, 161, 255, 0.5)',
        borderColor: 'rgba(99, 161, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  barchartbetweenMonth={
    labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug','Sep','Oct','Nov','Dec'],
    datasets:[
      {
        label:this._translateService.instant('number_recruitment'),
        data: this.countriesContractsCount,
        backgroundColor: 'rgba(99, 161, 255, 0.5)',
        borderColor: 'rgba(99, 161, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  
 

  chartOptions: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  createRecruitmentCountriesChart(): void {
    const ctx1 = this.barChart.nativeElement.getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: this.barChartData,
      options: this.chartOptions,
    });
  }

  createRecruitmentCountriesChartBetweenTwoMonth(): void {
    const ctx1 = this.barchartTowMonth.nativeElement.getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: this.barchartbetweenMonth,
      options: this.chartOptions,
    });
  }

 
  createRecruitmentYearChart() {
    const ctx2 = this.lineChart.nativeElement.getContext('2d');
    new Chart(ctx2, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: this.contractsCountPerYearName,
        datasets: [
          {
            label: this._translateService.instant('number_recruitment'),
            data: this.contractsCountPerYear,
            backgroundColor: 'limegreen',
            tension: 0.5,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }


  applyDateFilter(){

    const date = {
              from: this._datePipe.transform(this.from, 'MM/dd/YYYY'),
              to: this._datePipe.transform(this.toMonth, 'MM/dd/YYYY'),
            };
          if(date){
            this.getAllRecruitment(date);
          }
          else   this.getAllRecruitment();
  
  
  }

 
}

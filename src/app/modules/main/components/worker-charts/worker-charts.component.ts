import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartOptions } from 'chart.js';
import { HomeService } from '../../services/home.service';
import { IAllWorker } from '../../models/home.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';
import { DirectionService } from 'src/app/core/services/direction.service';
@UntilDestroy()
@Component({
  selector: 'app-worker-charts',
  templateUrl: './worker-charts.component.html',
  styleUrls: ['./worker-charts.component.scss'],
  providers: [DatePipe],
})
export class WorkerChartsComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartType') pieChartType!: ElementRef;
  @ViewChild('pieChartCareers') pieChartCareers!: ElementRef;
  @ViewChild('pieChartNationality') pieChartNationality!: ElementRef;
  @ViewChild('barTotalWorker') barTotalWorker!: ElementRef;
  from = '0';
  barChartTotal!: Chart;
  toMonth = '11';
  months = [
    { month: 'Jan', value: '0' },
    { month: 'Feb', value: '1' },
    { month: 'Mar', value: '2' },
    { month: 'Apr', value: '3' },
    { month: 'May', value: '4' },
    { month: 'Jun', value: '5' },
    { month: 'Jul', value: '6' },
    { month: 'Aug', value: '7' },
    { month: 'Sep', value: '8' },
    { month: 'Oct', value: '9' },
    { month: 'Nov', value: '10' },
    { month: 'Dec', value: '11' },
  ];
  workerData!: IAllWorker;
  WorkerTotal: any[] = [];
  chartType!: any;
  chartTypeCount: number[] = [];
  chartTypeName: string[] = [];
  chartCareer!: any;
  chartCareerCount: number[] = [];
  chartCareerName: string[] = [];
  chartNationality!: any;
  chartNationalityCount: number[] = [];
  chartNationalityName: string[] = [];
  WorkerType: string[] = [];
  WorkerLeasingCount: number[] = [];
  WorkersponsorCount: number[] = [];
  WorkerAdmissionCount: number[] = [];
  WorkerWaiverCount: number[] = [];

  pieChartTypeData = {
    labels: this.chartTypeName,
    datasets: [
      {
        label: this._translateService.instant('number_worker'),
        data: this.chartTypeCount,
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(99, 161, 255, 0.5)', 'limegreen'],
        hoverOffset: 4,
      },
    ],
  };

  pieChartCareersData = {
    labels: this.chartCareerName,
    datasets: [
      {
        label: this._translateService.instant('number_worker'),
        data: this.chartCareerCount,
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(99, 161, 255, 0.5)', 'lightcoral'],
        hoverOffset: 4,
      },
    ],
  };
  pieChartNationalityData = {
    labels: this.chartNationalityName,
    datasets: [
      {
        label: this._translateService.instant('number_worker'),
        data: this.chartNationalityCount,
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgba(99, 161, 255, 0.5)', 'limegreen'],
        hoverOffset: 4,
      },
    ],
  };
  barTotalWorkerData = {
    labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: this._translateService.instant('leasing'),
        data: this.WorkerLeasingCount,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: this._translateService.instant('sponsor'),
        data: this.WorkersponsorCount,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: this._translateService.instant('admission'),
        data: this.WorkerAdmissionCount,
        backgroundColor: 'rgba(255, 99, 71 ,0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: this._translateService.instant('waiver'),
        data: this.WorkerWaiverCount,
        backgroundColor: 'rgba(0, 191, 255, 0.5)',
        borderColor: 'rgba(0, 191, 255, 1.5)',
        borderWidth: 1,
      },
    ],
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
  constructor(
    private _translateService: TranslateService,
    private _homeService: HomeService,
    private _datePipe: DatePipe,
    public direction: DirectionService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getData('');
    this.getTotalWorker('');
    this._homeService.dashboardFilter$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res.idDepartment === '2') {
        if (res.date.from && res.date.to) {
          const date = {
            from: this._datePipe.transform(res.date.from.toLocaleDateString(), 'MM/dd/YYYY'),
            to: this._datePipe.transform(res.date.to.toLocaleDateString(), 'MM/dd/YYYY'),
          };
          this.getData(date);
          this.getTotalWorker(date);
        } else {
          this.getData();
          this.getTotalWorker();
        }
      }
    });
  }

  fullBarChart() {
    this.barTotalWorkerData = {
      labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: this._translateService.instant('leasing'),
          data: this.WorkerLeasingCount,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: this._translateService.instant('sponsor'),
          data: this.WorkersponsorCount,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: this._translateService.instant('admission'),
          data: this.WorkerAdmissionCount,
          backgroundColor: 'rgba(255, 99, 71 ,0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: this._translateService.instant('waiver'),
          data: this.WorkerWaiverCount,
          backgroundColor: 'rgba(0, 191, 255, 0.5)',
          borderColor: 'rgba(0, 191, 255, 1.5)',
          borderWidth: 1,
        },
      ],
    };
  }
  getData(date?: any) {
    this._homeService.getAllWorker(date).subscribe(res => {
      if (res) {
        this.workerData = res.data;
        this.chartType = this.workerData.cvCount.data;
        this.chartCareer = this.workerData.jobCount.data;
        this.chartNationality = this.workerData.countryCount.data;
      }
      if (this.chartCareer && this.chartType && this.chartNationality) {
        this.chartType.forEach((ele: any) => {
          this.chartTypeCount.push(ele.count);
          this.chartTypeName.push(ele.name);
        });
        this.chartCareer.forEach((ele: any) => {
          this.chartCareerCount.push(ele.count);
          this.chartCareerName.push(ele.name);
        });
        this.chartNationality.forEach((ele: any) => {
          this.chartNationalityCount.push(ele.count);
          this.chartNationalityName.push(ele.name);
        });
        if (date == '') {
          this.createCharts();
        }
      }
    });
  }

  getTotalWorker(date?: any) {
    this._homeService.getTotalWorker(date).subscribe(res => {
      if (res) {
        res.data.forEach((ele: any) => {
          if (ele.name == 'تنازل') {
            this.WorkerWaiverCount.push(ele.count);
          }
          if (ele.name == 'نقل كفالة') {
            this.WorkersponsorCount.push(ele.count);
          }
          if (ele.name == 'تأجير') {
            this.WorkerLeasingCount.push(ele.count);
          }
          if (ele.name == 'استقدام') {
            this.WorkerAdmissionCount.push(ele.count);
          }
        });

        if (date == '') {
          this.createBarChart();
        }
      }
    });
  }

  createCharts(): void {
    const pieChartType = this.pieChartType.nativeElement.getContext('2d');
    new Chart(pieChartType, {
      type: 'pie',
      data: this.pieChartTypeData,
    });
    const pieChartCareers = this.pieChartCareers.nativeElement.getContext('2d');
    new Chart(pieChartCareers, {
      type: 'pie',
      data: this.pieChartCareersData,
    });
    const pieChartNationality = this.pieChartNationality.nativeElement.getContext('2d');
    new Chart(pieChartNationality, {
      type: 'pie',
      data: this.pieChartNationalityData,
    });
  }
  createBarChart() {
    this.barChartTotal = new Chart(this.barTotalWorker.nativeElement.getContext('2d'), {
      type: 'bar',
      data: this.barTotalWorkerData,
      options: this.chartOptions,
    });
  }

  applyDateFilter() {
    const date = {
      from: this._datePipe.transform(this.from, 'MM/dd/YYYY'),
      to: this._datePipe.transform(this.toMonth, 'MM/dd/YYYY'),
    };
    if (date.from && date.to) {
      this.WorkerAdmissionCount = [];
      this.WorkerLeasingCount = [];
      this.WorkerWaiverCount = [];
      this.WorkersponsorCount = [];
      this.getTotalWorker(date);
      this.fullBarChart();
      this.barChartTotal.data = this.barTotalWorkerData;
      this.barChartTotal.update();
      this.getData(date);
    }
    if (!date.from && !date.to) {
      this.barChartTotal.destroy();
      this.getTotalWorker('');
      this.fullBarChart();
      this.barChartTotal.data = this.barTotalWorkerData;
      this.barChartTotal.update();
      this.getData('');
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { HomeService } from '../../services/home.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';
@UntilDestroy()
@Component({
  selector: 'app-surety-transfer-charts',
  templateUrl: './surety-transfer-charts.component.html',
  styleUrls: ['./surety-transfer-charts.component.scss'],
  providers: [DatePipe],
})
export class SuretyTransferChartsComponent {
  @ViewChild('pieChartTypeTransfer') pieChartTypeTransfer!: ElementRef;
  sponsorshipTransferCount: number[] = [];
  sponsorshipTransferName: string[] = [];
  pieChartTypeTransferData = {
    labels: this.sponsorshipTransferName,
    datasets: [
      {
        label: this._translateService.instant('number_requests'),
        data: this.sponsorshipTransferCount,
        backgroundColor: ['rgb(255, 99, 132, 0.5)', 'rgb(54, 162, 235, 0.5)', 'limegreen'],
        hoverOffset: 4,
      },
    ],
  };
  constructor(
    private _translateService: TranslateService,
    private _homeService: HomeService,
    private _datePipe: DatePipe
  ) {}
  ngOnInit(): void {}

  getData(date?: any) {
    this._homeService.getSponsorshipTransferStatistics(date).subscribe(res => {
      if (res) {
        res.data.forEach((ele: any) => {
          this.sponsorshipTransferCount.push(ele.count);
          this.sponsorshipTransferName.push(ele.name);
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
      if (res.idDepartment === '6') {
        if (res.date.from && res.date.to) {
          const date = {
            from: this._datePipe.transform(res.date.from.toLocaleDateString(), 'MM/dd/YYYY'),
            to: this._datePipe.transform(res.date.to.toLocaleDateString(), 'MM/dd/YYYY'),
          };
          this.getData(date);
        } else this.getData();
      }
    });
  }

  createCharts(): void {
    const pieChartTypeTransfer = this.pieChartTypeTransfer.nativeElement.getContext('2d');
    new Chart(pieChartTypeTransfer, {
      type: 'pie',
      data: this.pieChartTypeTransferData,
    });
  }
}

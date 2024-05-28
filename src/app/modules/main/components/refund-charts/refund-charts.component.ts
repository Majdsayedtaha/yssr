import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { HomeService } from '../../services/home.service';
import { IRefundStatistics, IStatistics } from '../../models/home.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-refund-charts',
  templateUrl: './refund-charts.component.html',
  styleUrls: ['./refund-charts.component.scss'],
})
export class RefundChartsComponent {
  @ViewChild('pieChartTypeRefund') pieChartTypeRefund!: ElementRef;
  refundStatistics!: IRefundStatistics;
  refundLabel!: string[];
  refundCount!: number[];
  byProcedureCountPie: IStatistics[] = [];

  constructor(private _translateService: TranslateService, private _homeService: HomeService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getData('');
    this._homeService.dashboardFilter$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res.idDepartment === '4') {
        if (res.date.from && res.date.to) {
          const date = {
            from: this._homeService.formatDate(res.date.from),
            to: this._homeService.formatDate(res.date.to),
          };
          this.getData(date);
        } else this.getData();
      }
    });
  }

  getData(date?: any) {
    this._homeService.getRefundStatistics(date).subscribe(res => {
      if (res) {
        this.byProcedureCountPie = res.data.byProcedureCount;
        this.refundStatistics = res.data;
        this.byProcedureCountPie?.forEach((ele: any) => {
          console.log(ele);
          this.refundCount?.push(ele.count);
          this.refundLabel?.push(ele.name);
        });
        if (date == '') {
          this.createCharts();
        }
      }
    });
  }
  pieChartTypeRefundData = {
    labels: this.refundLabel,
    datasets: [
      {
        label: this._translateService.instant('number_contracts_according_latest_procedure'),
        data: this.refundCount,
        backgroundColor: ['rgb(255, 99, 132, 0.5)', 'rgba(99, 161, 255, 0.5)', 'limegreen'],
        hoverOffset: 4,
      },
    ],
  };
  createCharts(): void {
    const pieChartTypeRefund = this.pieChartTypeRefund.nativeElement.getContext('2d');
    new Chart(pieChartTypeRefund, {
      type: 'pie',
      data: this.pieChartTypeRefundData,
    });
  }
}

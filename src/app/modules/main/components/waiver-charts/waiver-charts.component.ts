import { Component, ElementRef, INJECTOR, Inject, Injector, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IWaiverStatistics } from '../../models/home.interface';
import { HomeService } from '../../services/home.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';
@UntilDestroy()
@Component({
  selector: 'app-waiver-charts',
  templateUrl: './waiver-charts.component.html',
  styleUrls: ['./waiver-charts.component.scss'],
  providers: [DatePipe],
})
export class WaiverChartsComponent extends CoreBaseComponent {
  @ViewChild('pieChartTypeWaiver') pieChartTypeWaiver!: ElementRef;
  pieChartTypeWaiverData: any;
  wavierStatistics!: IWaiverStatistics;
  lastProcedureCount: any[] = [];
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _translateService: TranslateService,
    private _homeService: HomeService,
    private _datePipe: DatePipe
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getData('');
    this._homeService.dashboardFilter$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res.idDepartment === '5') {
        if (res.date.from && res.date.to) {
          const date = {
            from: this._datePipe.transform(res.date.from),
            to: this._datePipe.transform(res.date.to),
          };
          this.getData(date);
        } else this.getData();
      }
    });
  }

  getData(date?: any) {
    this._homeService.getWaiverStatistics(date).subscribe(res => {
      if (res) {
        this.wavierStatistics = res.data;
        this.lastProcedureCount = this.wavierStatistics.lastProcedureCount;
        this.pieChartTypeWaiverData = {
          labels: [this._translateService.instant('order_waiver'), this._translateService.instant('order_worker')],
          datasets: [
            {
              label: this._translateService.instant('number_requests'),
              data: [this.wavierStatistics.waiverTotalCount, this.wavierStatistics.externalWaiverTotalCount],
              backgroundColor: ['rgb(54, 162, 235)', 'rgba(99, 161, 255, 0.5)'],
              hoverOffset: 4,
            },
          ],
        };
        if (date == '') {
          this.createCharts();
        }
      }
    });
  }
  createCharts(): void {
    const pieChartTypeWaiver = this.pieChartTypeWaiver.nativeElement.getContext('2d');
    new Chart(pieChartTypeWaiver, {
      type: 'pie',
      data: this.pieChartTypeWaiverData,
    });
  }
}

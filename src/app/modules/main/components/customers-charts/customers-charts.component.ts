import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { ICustomerStatistics } from '../../models/home.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe } from '@angular/common';
@UntilDestroy()
@Component({
  selector: 'app-customers-charts',
  templateUrl: './customers-charts.component.html',
  styleUrls: ['./customers-charts.component.scss'],
  providers: [DatePipe],
})
export class CustomersChartsComponent implements OnInit {
  customerStatistics!: ICustomerStatistics;
  constructor(private _homeService: HomeService, private _datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getStatistics();

    this._homeService.dashboardFilter$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res.idDepartment === '3') {
        if (res.date.from && res.date.to) {
          const date = {
            from: this._datePipe.transform(res.date.from.toLocaleDateString(), 'MM/dd/YYYY'),
            to: this._datePipe.transform(res.date.to.toLocaleDateString(), 'MM/dd/YYYY'),
          };
          this.getStatistics(date);
        } else this.getStatistics();
      }
    });
  }
  getStatistics(date?: any) {
    this._homeService.getCustomerStatistics(date).subscribe(res => {
      if (res) {
        this.customerStatistics = res.data;
      }
    });
  }
}

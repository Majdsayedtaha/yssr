import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IEnum } from 'src/app/core/interfaces';
import { DateService } from './services/date.service';
import { HomeService } from './services/home.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { startWith } from 'rxjs';
export interface IDateFilter {
  dateFilter: FormControl<string | null>;
  department: FormControl<string | null>;
  from: FormControl<any | null>;
  to: FormControl<any | null>;
}
@UntilDestroy()
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private _dateAdapter = inject(DateAdapter);
  private _translateService = inject(TranslateService);

  departmentValue: string = '1';
  dateFilter: string = '1';
  filterDashboardFormGroup!: FormGroup<IDateFilter>;

  options: IEnum[] = [
    { id: '6', name: 'all_time' },
    { id: '1', name: 'this_month' },
    { id: '2', name: 'last_30_days' },
    { id: '3', name: 'last_month' },
    { id: '4', name: 'last_7_days' },
    { id: '5', name: 'last_week' },
  ];
  department: IEnum[] = [
    { id: '1', name: 'recruitment' },
    { id: '2', name: 'cvs' },
    { id: '3', name: 'customers' },
    { id: '4', name: 'refund_management' },
    { id: '5', name: 'waiver' },
    { id: '6', name: 'surety-transfer' },
    { id: '7', name: 'rent' },
    { id: '8', name: 'complaints' },
  ];

  constructor(private _fb: FormBuilder, private _dateService: DateService, private _homeService: HomeService) {}

  ngOnInit() {
    this.filterDashboardFormGroup = this._fb.group({
      dateFilter: ['6'],
      department: ['1'],
      from: [null],
      to: [null],
    });
    this.checkDepartment();
    this.checkDate();

    this._translateService.onLangChange
      .pipe(startWith({ lang: this._translateService.currentLang }))
      .subscribe(({ lang }) => {
        lang === 'ar' ? this._dateAdapter.setLocale('ar') : this._dateAdapter.setLocale('en');
      });
  }

  checkDepartment() {
    this.filterDashboardFormGroup
      .get('department')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        this.departmentValue = value || '1';
        this.filterDashboardFormGroup.get('dateFilter')?.patchValue('6');
      });
  }

  checkDate() {
    this.filterDashboardFormGroup
      .get('dateFilter')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        let date!: { from: Date; to: Date };

        switch (value) {
          case '1':
            date = this._dateService.getThisMonth();
            this.filterDashboardFormGroup.patchValue({ from: date.from, to: date.to }, { emitEvent: false });
            this._homeService.dashboardFilter$.next({ idDepartment: this.departmentValue, date: date });
            break;

          case '2':
            date = this._dateService.getLast30Days();
            this.filterDashboardFormGroup.patchValue({ from: date.from, to: date.to }, { emitEvent: false });
            this._homeService.dashboardFilter$.next({ idDepartment: this.departmentValue, date: date });
            break;

          case '3':
            date = this._dateService.getLastMonth();
            this.filterDashboardFormGroup.patchValue({ from: date.from, to: date.to }, { emitEvent: false });
            this._homeService.dashboardFilter$.next({ idDepartment: this.departmentValue, date: date });
            break;

          case '4':
            date = this._dateService.getLastSevenDays();
            this.filterDashboardFormGroup.patchValue({ from: date.from, to: date.to }, { emitEvent: false });
            this._homeService.dashboardFilter$.next({ idDepartment: this.departmentValue, date: date });
            break;

          case '5':
            date = this._dateService.getLastWeek();
            this.filterDashboardFormGroup.patchValue({ from: date.from, to: date.to }, { emitEvent: false });
            this._homeService.dashboardFilter$.next({ idDepartment: this.departmentValue, date: date });
            break;

          case '6':
            this._homeService.dashboardFilter$.next({
              idDepartment: this.departmentValue,
              date: { from: null, to: null },
            });
            break;
        }
      });

    this.filterDashboardFormGroup
      .get('from')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(from => {
        if (this.filterDashboardFormGroup.value?.['to'] && from) {
          this.getAllTimeDashboard(from, this.filterDashboardFormGroup.value?.['to']);
        }
      });

    this.filterDashboardFormGroup
      .get('to')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(to => {
        if (this.filterDashboardFormGroup.value?.['from'] && to) {
          this.getAllTimeDashboard(this.filterDashboardFormGroup.value?.['from'], to);
        }
      });
  }

  getAllTimeDashboard(from: Date, to: Date) {
    this._homeService.dashboardFilter$.next({
      idDepartment: this.departmentValue,
      date: { from, to },
    });
  }
}

import { DatePipe } from '@angular/common';
import { EventEmitter, Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  @Inject(DatePipe) datePipe!: DatePipe;

  constructor() {}
  dateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  setDate(date: Date) {
    console.log(date)
    this.dateChanged.emit(date);
  }
  getThisMonth() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const startDate = new Date(today.getFullYear(), currentMonth, 1);
    const currentDate = new Date();

    return { from: startDate, to: currentDate };
  }

  getLast30Days() {
    const today = new Date();
    const last30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);

    return {
      from: last30Days,
      to: today,
    };
  }

  getLastMonth() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

    return {
      from: firstDay,
      to: lastDay,
    };
  }

  getLastSevenDays() {
    const today = new Date();
    const lastSevenDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

    return {
      from: lastSevenDays,
      to: today,
    };
  }

  getLastWeek() {
    let today = new Date();
    let startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - 1);
    let endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);

    return {
      from: startOfWeek,
      to: endOfWeek,
    };
  }
}

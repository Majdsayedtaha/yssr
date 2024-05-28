import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperFunctionsService {
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  ReadDateClearly = (element: any) => {
    element.created_at = this.formatDate(element.created_at, false);
    return element;
  };

  ReadDateTimeClearly = (element: any) => {
    element.created_at = this.formatDate(element.created_at, true);
    return element;
  };

  SnakeToCamel = (s: any) => s.replace(/(_\w)/g, (k: any) => k[1].toUpperCase());

  //#region String
  camelCase(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }
  //#end region

  //#region Time

  /**
   *
   * @param date Date
   * @param withMinutes return minutes of times
   * @param withSeconds return seconds of times
   * @returns time 24 H:i:s
   */
  formatTime(date: Date, withMinutes: boolean = true, withSeconds: boolean = true) {
    let formatTime: string[] = [];

    let hours = date.getHours();
    let hoursStr = (hours < 10 ? '0' + hours : hours).toString();
    formatTime.push(hoursStr);

    if (withMinutes) {
      let minutes = date.getMinutes();
      let minuteStr = (minutes < 10 ? '0' + minutes : minutes).toString();
      formatTime.push(minuteStr);
    }

    if (withSeconds) {
      let seconds = date.getSeconds();
      let secondsStr = (seconds < 10 ? '0' + seconds : seconds).toString();
      formatTime.push(secondsStr);
    }

    return formatTime.join(':');
  }

  /**
   *
   * @param date Date
   * @returns Time 12 Hour
   */
  convertTimeAmPm(date: any) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  /**
   *
   * @param time12 time in 12 Hour H:i [AM|PM]
   * @returns time in 24 hour
   */
  convert12to24Hour(time12: string): string {
    const [time, modifier] = time12.split(' ');

    let [hours, minutes] = time.split(':');

    if (modifier == 'AM') {
      if (parseInt(hours, 10) == 12) hours = '0';
    } else {
      if (parseInt(hours, 10) < 12) hours = (parseInt(hours, 10) + 12).toString();
    }
    let time24 = '';

    if (parseInt(hours, 10) < 10) time24 = '0';

    time24 += parseInt(hours, 10) + ':' + minutes;
    return time24;
  }

  convert24to12(time24: string): string {
    let modifier = 'AM';
    let [hours, minutes] = time24.split(':');
    let numHour = +hours;
    if (numHour >= 12) {
      if (numHour != 12) numHour -= 12;
      modifier = 'PM';
    }
    let zero = '';
    if (numHour <= 9) zero = '0';
    return zero + numHour.toString() + ':' + minutes + ' ' + modifier;
  }

  /**
   *
   * @param time1 time in format H:i
   * @param time2 time in format H:i
   * @returns difference between times in minutes
   */
  diffTime(time1: Date, time2: Date): number {
    let hour = time1.getHours();
    let minutes = time1.getMinutes();
    let hour2 = time2.getHours();
    let minutes2 = time2.getMinutes();
    let diffHour = Math.abs(+hour - +hour2) * 60;
    let diffMinutes = Math.abs(+minutes - +minutes2);
    return diffHour + diffMinutes;
  }

  //#end region

  //#region Date

  /**
   *
   * @param startDate start date
   * @param endDate end date
   * @returns difference between dates in one of the format (min,hours,days)
   */
  dateDiff(startDate: any, endDate: any): string {
    let timeLeft: string = '';
    let days: number = this.daysDiff(startDate, endDate);
    let ticks: number = this.diffTime(startDate, endDate);

    if (days <= 0) {
      // less than day
      if (ticks < 60 * 24) {
        //hour
        if (ticks >= 60) timeLeft += `${ticks / 60} Hours`;
        //min
        else timeLeft += `${ticks} Minutes`;
      }
    } else timeLeft += `${days} Days`;
    return timeLeft;
  }

  /**
   *
   * @param startDate start date
   * @param endDate end date
   * @returns difference between dates in years
   */
  yearsDiff(startDate: Date, endDate: Date): number {
    return endDate.getFullYear() - startDate.getFullYear();
  }

  /**
   *
   * @param startDate start date
   * @param endDate end date
   * @returns difference between dates in months
   */
  monthDiff(startDate: Date, endDate: Date): number {
    return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
  }

  /**
   *
   * @param startDate start date
   * @param endDate end date
   * @returns difference between dates in weeks
   */
  weeksDiff(startDate: Date, endDate: Date): number {
    return Math.floor(this.daysDiff(startDate, endDate) / 7);
  }

  /**
   *
   * @param startDate start date
   * @param endDate end date
   * @returns difference between dates in days
   */
  daysDiff(startDate: Date, endDate: Date): number {
    const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  /**
   *
   * @param start start date
   * @param end  end date
   * @returns weeks between them
   */
  getDays(start: Date, end: Date): [string] {
    let weekDaysList: [string] = [''];
    let numDay = 0;
    let DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = start;
    while (d <= end) {
      if (++numDay > 7) break;
      weekDaysList.push(DAYS[d.getDay()]);
      d.setDate(d.getDate() + 1);
    }
    weekDaysList.splice(0, 1);
    return weekDaysList;
  }

  /**
   *
   * @param date
   * @returns date in format Y-m-d H:i:s
   */
  formatDate(date: any, withTime: boolean) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    let time = '';
    if (withTime) {
      time = this.convert12to24Hour(this.convertTimeAmPm(d));
    }

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return withTime ? [year, month, day].join('-') + ' ' + [time].join(':') : [year, month, day].join('-');
  }

  modifyDate(date: any, days: number, add: boolean) {
    if (add) date.setDate(date.getDate() + days);
    else date.setDate(date.getDate() - days);
    return date;
  }

  /**
   *
   * @param date1 first date
   * @param date2 second date
   * @returns -1 if date 1 is less than date2 || 1  if date 1 is bigger than date2 || 0  if date 1 is equal than date2
   */
  compareDates(date1: Date, date2: Date, time: boolean = true): number {
    if (
      date1.getFullYear() < date2.getFullYear() ||
      (date1.getFullYear() == date2.getFullYear() && date1.getMonth() < date2.getMonth()) ||
      (date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() < date2.getDate()) ||
      (date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate() &&
        date1.getTime() < date2.getTime() &&
        time)
    )
      return -1;
    if (
      date1.getFullYear() > date2.getFullYear() ||
      (date1.getFullYear() == date2.getFullYear() && date1.getMonth() > date2.getMonth()) ||
      (date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() > date2.getDate()) ||
      (date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate() &&
        date1.getTime() > date2.getTime() &&
        time)
    )
      return 1;
    return 0;
  }

  //#end region

  //#region File

  /**
   *
   * @param fileName path of file
   * @returns extension of path
   */
  getExtension(fileName: string) {
    let parts = fileName.split('.');
    return parts[parts.length - 1];
  }

  /**
   *
   * @param file send file type file
   * @returns true if its image or not
   */
  isImg(file: any) {
    switch (this.getExtension(file)) {
      case 'jpeg':
      case 'jpg':
      case 'png':
        return true;
    }
    return false;
  }

  //#end region

  // #region Array
  chunks<T>(array: T[], size: number): T[][] {
    let results: T[][] = [];
    while (array.length) results.push(array.splice(0, size));
    return results;
  }

  //! Log the invalid fields:
  // const invalidFields: string[] = [];
  // for (const controlName in this.getFormGroup('additionalDetails')?.controls) {
  //   if (this.getFormGroup('additionalDetails')?.controls[controlName].invalid) {
  //     invalidFields.push(controlName);
  //   }
  // }
  // console.log('Invalid fields:', invalidFields);
}

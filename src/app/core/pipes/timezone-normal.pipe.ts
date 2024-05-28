import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezoneToDate',
})
export class TimezoneToDatePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (value) {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${day}/${month}/${year}`;
    }
    return '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: string | undefined, format: '12' | '24'): string {
    if (value) {
      if (format == '12') {
        let modifier = 'AM';
        let [hours, minutes] = value.split(':');
        let numHour = +hours;
        if (numHour >= 12) {
          if (numHour != 12) numHour -= 12;
          modifier = 'PM';
        }
        let zero = "";
        if (numHour <= 9) zero = "0";
        return zero + numHour.toString() + ":" + minutes + " " + modifier;
      } else {
        const [time, modifier] = value.split(' ');

        let [hours, minutes] = time.split(':');

        if (modifier == "AM") {
          if (parseInt(hours, 10) == 12) hours = "0";
        }
        else {
          if (parseInt(hours, 10) < 12) hours = (parseInt(hours, 10) + 12).toString();
        }
        let time24 = '';

        if (parseInt(hours, 10) < 10)
          time24 = '0';

        time24 += parseInt(hours, 10) + ':' + minutes;
        return time24;
      }
    }
    return '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { toHijri, toGregorian } from "hijri-converter";

@Pipe({
  name: 'hijriGregorianDate',
})
export class HijriGregorianDatePipe implements PipeTransform {
  transform(value: string | undefined, type: 'hijri' | 'gregorian' = 'hijri'): string {
    if (value) {
      if (type === 'hijri') {
        const date = new Date(value);
        const hijri: {
          hy: number;
          hm: number;
          hd: number;
        } = toHijri(date.getFullYear(), date.getMonth(), date.getDate());


        return [hijri.hy, hijri.hm.toString().padStart(2, '0'), hijri.hd.toString().padStart(2, '0')].join('-');
      } else {
        const [hy, hm, hd] = value.split('-');
        const date: {
          gy: number;
          gm: number;
          gd: number;
        } = toGregorian(+hy, +hm, +hd);

        return [date.gy, date.gm.toString().padStart(2, '0'), date.gd.toString().padStart(2, '0')].join('-');
      }
    }
    return '';
  }
}

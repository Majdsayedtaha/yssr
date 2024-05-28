import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
@Pipe({
  name: 'fullBathUrl',
})
export class FullUrlPipe implements PipeTransform {
  transform(value: string): string {
    return value ? [environment.url, value].join('/') : '';
  }
}

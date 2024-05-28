import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Pipe({
  name: 'sanitizerUrl',
})
export class SanitizerUrlPipe implements PipeTransform {
  constructor(private sanitize: DomSanitizer) {}

  transform(value: string | File): SafeUrl {
    if (value instanceof File) {
      if (value.type.includes('image')) {
        value = URL.createObjectURL(value);
        return this.sanitize.bypassSecurityTrustUrl(value);
      }
      return '';
    }
    return this.sanitize.bypassSecurityTrustUrl(value);
  }
}

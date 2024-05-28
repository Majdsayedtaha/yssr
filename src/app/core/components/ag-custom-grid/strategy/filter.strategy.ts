import { Injectable } from '@angular/core';
import { FieldTypes } from '../enums/field-types.enum';
import { TextType } from './types/text.type';
import { RangeNumberType } from './types/range-number.type';
import { IFilterStrategy } from '../models/filter-strategy.interface';
import { RangeDateType } from './types/range-date.type';
import { RadioType } from './types/radio.type';
import { SelectType } from './types/select.type';
@Injectable({ providedIn: 'root' })
export class FilterStrategy {
  matcher(column: string): IFilterStrategy {
    switch (column) {
      case FieldTypes.text:
        return new TextType();

      case FieldTypes.rangeNumber:
        return new RangeNumberType();

      case FieldTypes.rangeDate:
        return new RangeDateType();

      case FieldTypes.radio:
        return new RadioType();
      case FieldTypes.select:
        return new SelectType();

      default:
        return new TextType();
    }
  }
}

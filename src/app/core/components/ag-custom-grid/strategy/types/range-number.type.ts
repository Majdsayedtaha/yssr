import { FilterRangeNumberRenderer } from '../../cell-renderers/filter-range-number.renderer';
import { IFilterStrategy } from '../../models/filter-strategy.interface';

export class RangeNumberType implements IFilterStrategy {
  getFilterRenderer() {
    return FilterRangeNumberRenderer;
  }
}

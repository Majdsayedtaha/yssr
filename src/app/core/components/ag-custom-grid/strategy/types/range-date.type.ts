import { FilterRangeDateRenderer } from '../../cell-renderers/filter-range-date.renderer';
import { IFilterStrategy } from '../../models/filter-strategy.interface';

export class RangeDateType implements IFilterStrategy {
  getFilterRenderer() {
    return FilterRangeDateRenderer;
  }
}

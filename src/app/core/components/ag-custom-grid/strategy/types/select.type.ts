import { FilterSelectRenderer } from '../../cell-renderers/filter-select.renderer';
import { IFilterStrategy } from '../../models/filter-strategy.interface';

export class SelectType implements IFilterStrategy {
  getFilterRenderer() {
    return FilterSelectRenderer;
  }
}

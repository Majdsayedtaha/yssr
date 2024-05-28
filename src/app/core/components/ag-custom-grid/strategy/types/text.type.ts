import { FilterTextRenderer } from '../../cell-renderers/filter-text.renderer';
import { IFilterStrategy } from '../../models/filter-strategy.interface';

export class TextType implements IFilterStrategy {
  getFilterRenderer() {
    return FilterTextRenderer;
  }
}

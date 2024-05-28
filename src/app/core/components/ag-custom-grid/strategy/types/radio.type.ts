import { FilterRadioRenderer } from '../../cell-renderers/filter-radio.renderer';
import { IFilterStrategy } from '../../models/filter-strategy.interface';

export class RadioType implements IFilterStrategy {
  getFilterRenderer() {
    return FilterRadioRenderer;
  }
}

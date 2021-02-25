/**
 * Context field for filter panel options
 */
import DataContext = require('Core/DataContext');

export = class extends DataContext {
  constructor(options) {
      super(options);
      this.options = options;
  }

  protected _moduleName: string = 'Controls/_filterPopup/Panel/Wrapper/_FilterPanelOptions'
};

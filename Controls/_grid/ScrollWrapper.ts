import Control = require('Core/Control');
import HorizontalScrollWrapperTpl = require('wml!Controls/_grid/ScrollWrapperTemplate');

var HorizontalScrollWrapper = Control.extend({
   _template: HorizontalScrollWrapperTpl,
   _beforeMount: function(opt) {
      this._localPositionHandler = opt.positionChangeHandler;
   },
   _getGridStyles: function() {
      let style = '';
      const { listModel } = this._options;
      const { _options: { stickyColumnsCount, header } } = listModel;

      let offset = 1;
      if (listModel.getMultiSelectVisibility() !== 'hidden') {
         offset += 1;
      }
      style += `grid-column:${stickyColumnsCount + offset} / ${header.length + offset};`;
      style += `top:${this._options.topOffset}px;`;
      return style;
   },
});

export = HorizontalScrollWrapper;

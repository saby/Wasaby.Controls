import Control = require('Core/Control');
import HorizontalScrollWrapperTpl = require('wml!Controls/_grid/ScrollWrapperTemplate');

var HorizontalScrollWrapper = Control.extend({
   _template: HorizontalScrollWrapperTpl,
   _gridStyle: null,

   _beforeMount: function(opt) {
      this._localPositionHandler = opt.positionChangeHandler;
      this._gridStyle = this._getGridStyles(opt);
   },

   _afterRender: function() {
      if (this._needNotifyResize) {
         this._children.columnScrollbar.recalcSizes();
         this._needNotifyResize = false;
      }
   },

   _beforeUpdate: function(opt) {
      const newStyle = this._getGridStyles(opt);
      if (this._gridStyle !== newStyle) {
         this._gridStyle = newStyle;
         this._needNotifyResize = true;
      }
   },

   _getGridStyles: function(opt) {
      let style = '';
      const { listModel } = opt;
      const maxEndColumn = listModel.getMaxEndColumn();
      const stickyColumnsCount = listModel.getStickyColumnsCount();
      const header = listModel.getHeader();
      let offset = 0;
      if (listModel.getMultiSelectVisibility() !== 'hidden') {
         offset += 1;
      }
      style += `grid-column:${stickyColumnsCount + 1 + offset} / ${(maxEndColumn ? maxEndColumn : header.length + 1) + offset};`;
      style += `top:${opt.topOffset}px;`;
      style += `width: ${opt.scrollWidth}px`;
      return style;
   }
});

export = HorizontalScrollWrapper;

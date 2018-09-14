define('Controls/Date/PeriodDialog/MonthsRange', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Date/Mixin/EventProxy',
   'Controls/Date/model/DateRange',
   'Controls/Calendar/Utils',
   'Controls/Date/PeriodDialog/MonthsRangeItem',
   'wml!Controls/Date/PeriodDialog/MonthsRange',
   'css!Controls/Date/Utils/RangeSelection'
], function(
   BaseControl,
   coreMerge,
   EventProxyMixin,
   DateRangeModel,
   CalendarControlsUtils,
   MonthsRangeItem,
   componentTmpl
) {

   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Date/PeriodDialog
    * @extends Core/Control
    * @mixes Controls/Date/interface/IPeriodDialog
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Date/PeriodLiteDialog
    *
    */

   var _private = {
   };

   var Component = BaseControl.extend([EventProxyMixin], {
      _template: componentTmpl,

      constructor: function() {
         Component.superclass.constructor.apply(this, arguments);
         this._rangeModel = new DateRangeModel();
         CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
      },

      _beforeMount: function(options) {
         this._year = options.year || (new Date()).getFullYear();
         this._rangeModel.update(options);

         // this._updateRangeItems(options);
      },

      _beforeUpdate: function(options) {
         this._rangeModel.update(options);

         // this._updateRangeItems(options);
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
      },

      _onItemClick: function(e) {
         e.stopPropagation();
      }

   });

   Component._private = _private;

   Component.SELECTION_VEIW_TYPES = MonthsRangeItem.SELECTION_VEIW_TYPES;

   Component.getDefaultOptions = function() {
      return coreMerge({
         selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.days
      }, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
   };

   // Component.getOptionTypes = function() {
   //    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
   // };

   return Component;
});

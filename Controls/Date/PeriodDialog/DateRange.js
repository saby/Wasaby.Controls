define('Controls/Date/PeriodDialog/DateRange', [
   'Core/Control',
   'Core/helpers/Date/format',
   'Controls/Date/Mixin/EventProxy',
   'Controls/Date/model/DateRange',
   'Controls/Date/Month/Model',
   'Controls/Date/Utils/DateRangeQuantum',
   'Controls/Calendar/Utils',
   'Controls/Utils/Date',
   'wml!Controls/Date/PeriodDialog/DateRange',
   'wml!Controls/Date/PeriodDialog/DateRangeItem',
   'css!theme?Controls/Date/Utils/RangeSelection'
], function(
   BaseControl,
   formatDate,
   EventProxy,
   DateRangeModel,
   modelViewModel,
   quantumUtils,
   DateControlsUtils,
   dateUtils,
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
      updateView: function(self, options) {
         self._rangeModel.update(options);
         self._monthSelectionEnabled = options.selectionType === 'range' ||
            (options.selectionType === 'quantum' && quantumUtils.monthSelectionEnabled(options.quantum) &&
               options.quantum.months[0] === 1);
      }
   };

   var Component = BaseControl.extend([EventProxy], {
      _template: componentTmpl,

      _monthViewModel: modelViewModel,

      _weekdaysCaptions: DateControlsUtils.getWeekdaysCaptions(),
      _formatDate: formatDate,

      _monthSelectionEnabled: true,
      _selectionProcessing: false,

      constructor: function() {
         Component.superclass.constructor.apply(this, arguments);
         this._rangeModel = new DateRangeModel();
         DateControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
      },

      _beforeMount: function(options) {
         this._month = options.month || new Date();
         _private.updateView(this, options);
      },

      _beforeUpdate: function(options) {
         _private.updateView(this, options);
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
      },

      _monthCaptionClick: function(e, month) {
         if (this._monthSelectionEnabled) {
            this._notify('fixedPeriodClick', [month, dateUtils.getEndOfMonth(month)]);
         }
      },

      /**
       * [текст, условие, если true, если false]
       * @param prefix
       * @param style
       * @param cfgArr
       * @private
       */
      _prepareCssClass: function(prefix, style, cfgArr) {
         var cssClass = prefix;
         if (style) {
            cssClass += '-' + style;
         }
         return cfgArr.reduce(function(previousValue, currentValue, index) {
            var valueToAdd = currentValue[0] ? currentValue[1] : currentValue[2];
            if (valueToAdd) {
               return previousValue + '-' + valueToAdd;
            }
            return previousValue;
         }, cssClass);
      },

      _onItemClick: function(e) {
         e.stopPropagation();
      }

   });

   Component._private = _private;

   // Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

   // Component.getDefaultOptions = function() {
   //    return coreMerge({}, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
   // };

   // Component.getOptionTypes = function() {
   //    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
   // };

   return Component;
});

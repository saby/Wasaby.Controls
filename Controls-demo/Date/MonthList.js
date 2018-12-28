define('Controls-demo/Date/MonthList', [
   'Core/Control',
   'Controls-demo/Date/MonthListSource',
   'wml!Controls-demo/Date/MonthList',
   'wml!Controls-demo/Date/MonthListDay'
], function(
   BaseControl,
   MonthListSource,
   template,
   dayTemplate
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _dayTemplate: dayTemplate,
      _startValue: new Date(1900, 0, 1),
      _endValue: new Date(1900, 0, 31),
      _month: new Date(2018, 0, 1),
      _selectionProcessing: false,
      _selectionHoveredValue: null,
      _selectionBaseValue: null,
      _source: null,

      _beforeMount: function() {
         this._source = new MonthListSource();
      },

      _setSelection: function() {
         var value = new Date();
         this._selectionProcessing = true;
         this._selectionBaseValue = value;
         this._selectionHoveredValue = value;
      },

      _setSelectionProcessing: function() {
         this._selectionProcessing = true;
      },

      _setEndValue: function() {
         var value = new Date();
         this.endValue = value;
         this._notify('endValueChanged', [value]);
         this._forceUpdate();
      },
   });
   return ModuleClass;
});

define('Controls/Input/Date/Range', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Calendar/Utils',
   'Controls/Date/model/DateRange',
   'Controls/Input/interface/IDateTimeMask',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Input/Date/Range/Range',
   'css!Controls/Input/Date/Range/Range'
], function(
   Control,
   coreMerge,
   CalendarControlsUtils,
   DateRangeModel,
   IDateTimeMask,
   tmplNotify,
   template
) {

   /**
    * Control for entering date range.
    * @class Controls/Input/Date/Range
    * @mixes Controls/Date/interface/IRange
    * @mixes Controls/Input/interface/IDateMask
    * @mixes Controls/Input/interface/IValidation
    * @control
    * @public
    * @category Input
    */

   var Component = Control.extend([], {
      _template: template,
      _proxyEvent: tmplNotify,

      _rangeModel: null,

      _beforeMount: function(options) {
         this._rangeModel = new DateRangeModel();
         this._rangeModel.update(options);
         CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
      },

      _beforeUpdate: function(options) {
         this._rangeModel.update(options);
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
      },

      _openDialog: function(event) {
         var className;

         if (!this._options.chooseMonths && !this._options.chooseQuarters && !this._options.chooseHalfyears) {
            className = 'controls-DateRangeLinkLite__picker-years-only';
         } else {
            className = 'controls-DateRangeLinkLite__picker-normal';
         }

         this._children.opener.open({
            opener: this,
            target: this._container,
            className: className,
            eventHandlers: {
               onResult: this._onResult.bind(this)
            },
            templateOptions: {
               startValue: this._rangeModel.startValue,
               endValue: this._rangeModel.endValue,
               selectionType: this._options.selectionType,
               quantum: this._options.quantum,
            }
         });
      },

      _onResult: function(startValue, endValue) {
         this._notify('startValueChanged', [startValue]);
         this._notify('endValueChanged', [endValue]);
         this._children.opener.close();
         this._forceUpdate();
      },
   });

   Component.getDefaultOptions = function() {
      return coreMerge({}, IDateTimeMask.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IDateTimeMask.getOptionTypes());
   };

   return Component;

});

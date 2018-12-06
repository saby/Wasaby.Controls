define('Controls/Input/Date/Range', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Calendar/Utils',
   'Controls/Date/model/DateRange',
   'Controls/Input/interface/IDateTimeMask',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Input/Date/Range/Range',
   'css!theme?Controls/Input/Date/Range/Range'
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
    * <a href="/materials/demo-ws4-input-daterange">Demo examples.</a>.
    * @class Controls/Input/Date/Range
    * @extends Core/Control
    * @mixes Controls/Input/interface/IInputBase
    * @mixes Controls/Date/interface/IRange
    * @mixes Controls/Input/interface/IInputDateRange
    * @mixes Controls/Input/interface/IDateMask
    * @mixes Controls/Input/interface/IValidation
    * @css @spacing_DateRange-between-input-button Spacing between input field and button.
    * @control
    * @public
    * @demo Controls-demo/Input/Date/RangePG
    * @category Input
    * @author Миронов А.Ю.
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
         this._children.opener.open({
            opener: this,
            target: this._container,
            className: 'controls-PeriodDialog__picker',
            isCompoundTemplate: true,
            horizontalAlign: { side: 'right' },
            corner: { horizontal: 'left' },
            eventHandlers: {
               onResult: this._onResult.bind(this)
            },
            templateOptions: {
               startValue: this._rangeModel.startValue,
               endValue: this._rangeModel.endValue,
               selectionType: this._options.selectionType,
               quantum: this._options.quantum,
               headerType: 'input',
               rangeselect: true,
               handlers: {
                  onChoose: this._onResultWS3.bind(this)
               }
            }
         });
      },

      _onResultWS3: function(event, startValue, endValue) {
         this._onResult(startValue, endValue);
      },

      _onResult: function(startValue, endValue) {
         this._rangeModel.startValue = startValue;
         this._rangeModel.endValue = endValue;
         this._children.opener.close();
         this._forceUpdate();
      }
   });

   Component.getDefaultOptions = function() {
      return coreMerge({}, IDateTimeMask.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge({}, IDateTimeMask.getOptionTypes());
   };

   return Component;

});

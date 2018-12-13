define('Controls/Input/Date/RangeLink', [
   'Core/Control',
   'Core/core-merge',
   'Controls/Input/Date/interface/ILinkView',
   'Controls/Date/interface/IRangeSelectable',
   'Controls/Date/model/DateRange',
   'Controls/Calendar/Utils',
   'wml!Controls/Input/Date/RangeLink/RangeLink',
   'css!theme?Controls/Input/Date/RangeLink/RangeLink'
], function(
   BaseControl,
   coreMerge,
   ILinkView,
   IRangeSelectable,
   DateRangeModel,
   CalendarControlsUtils,
   componentTmpl
) {

   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Input/Date/RangeLink
    * @extends Core/Control
    * @mixes Controls/Input/Date/interface/ILinkView
    * @mixes Controls/Date/interface/IRangeSelectable
    * @control
    * @public
    * @category Input
    * @author Водолазских А.А.
    * @demo Controls-demo/Input/Date/RangeLink
    *
    */

   var Component = BaseControl.extend({
      _template: componentTmpl,

      _rangeModel: null,

      _beforeMount: function(options) {
         this._rangeModel = new DateRangeModel();
         CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
         this._rangeModel.update(options);
      },

      _beforeUpdate: function(options) {
         this._rangeModel.update(options);
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
               headerType: 'link',
               closeButtonEnabled: true,
               quantum: this._options.ranges,
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
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
      }
   });

   Component.EMPTY_CAPTIONS = ILinkView.EMPTY_CAPTIONS;

   Component.getDefaultOptions = function() {
      return coreMerge(coreMerge({}, IRangeSelectable.getDefaultOptions()), ILinkView.getDefaultOptions());
   };

   Component.getOptionTypes = function() {
      return coreMerge(coreMerge({}, IRangeSelectable.getOptionTypes()), ILinkView.getOptionTypes());
   };

   return Component;
});
